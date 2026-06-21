import { useState, useCallback, useRef, useEffect } from 'react';

interface TooltipState {
  visible: boolean;
  text: string;
  sentenceId: string | null;
  /** Position relative to viewport */
  x: number;
  y: number;
  /** Whether tooltip should render above (true) or below (false) */
  above: boolean;
}

const INITIAL_STATE: TooltipState = {
  visible: false,
  text: '',
  sentenceId: null,
  x: 0,
  y: 0,
  above: false,
};

export function useTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState>(INITIAL_STATE);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = useCallback((sentenceId: string, text: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sentenceMidX = rect.left + rect.width / 2;
    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;

    // Show above if more space above, or below if more below
    const above = spaceAbove > spaceBelow && spaceAbove > 120;

    // Clamp X to keep tooltip on screen
    const x = Math.max(20, Math.min(window.innerWidth - 20, sentenceMidX));
    const y = above ? rect.top : rect.bottom;

    // Haptic feedback on supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    setTooltip({
      visible: true,
      text,
      sentenceId,
      x,
      y,
      above,
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip(INITIAL_STATE);
  }, []);

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!tooltip.visible) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;

      // Don't close if clicking the tooltip itself
      if (tooltipRef.current?.contains(target)) return;

      // Don't close if clicking a sentence (will trigger new tooltip)
      if ((target as HTMLElement).classList?.contains('sentence')) return;

      hideTooltip();
    };

    // Use a small delay to prevent the same click from closing
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [tooltip.visible, hideTooltip]);

  return {
    tooltip,
    tooltipRef,
    showTooltip,
    hideTooltip,
  };
}
