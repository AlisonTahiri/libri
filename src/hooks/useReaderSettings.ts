import { useState, useCallback, useEffect } from 'react';
import type { Theme, ReaderSettings } from '../types';
import { DEFAULT_READER_SETTINGS } from '../types';

const STORAGE_KEY = 'libri-reader-settings';

function loadSettings(): ReaderSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_READER_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_READER_SETTINGS;
}

function applySettingsToDom(settings: ReaderSettings) {
  const root = document.documentElement;

  // Theme class
  root.classList.remove('dark', 'light', 'sepia');
  root.classList.add(settings.theme);

  // Reader CSS variables
  root.style.setProperty('--reader-font-size', `${settings.fontSize}px`);
  root.style.setProperty('--reader-line-height', `${settings.lineHeight}`);
  root.style.setProperty('--reader-max-width', `${settings.maxWidth}px`);
  root.style.setProperty('--reader-h-padding', `${settings.hPadding}rem`);

  // Update theme-color meta tag
  const themeColors: Record<Theme, string> = {
    dark: '#0d1117',
    light: '#ffffff',
    sepia: '#f4ecd8',
  };
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', themeColors[settings.theme]);
}

export function useReaderSettings() {
  const [settings, setSettingsState] = useState<ReaderSettings>(loadSettings);

  // Apply on mount and when settings change
  useEffect(() => {
    applySettingsToDom(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((partial: Partial<ReaderSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...partial }));
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    updateSettings({ theme });
  }, [updateSettings]);

  const setFontSize = useCallback((fontSize: number) => {
    updateSettings({ fontSize: Math.max(14, Math.min(28, fontSize)) });
  }, [updateSettings]);

  const setLineHeight = useCallback((lineHeight: number) => {
    updateSettings({ lineHeight: Math.max(1.4, Math.min(2.4, lineHeight)) });
  }, [updateSettings]);

  const setMaxWidth = useCallback((maxWidth: number) => {
    updateSettings({ maxWidth: Math.max(520, Math.min(800, maxWidth)) });
  }, [updateSettings]);

  const setHPadding = useCallback((hPadding: number) => {
    updateSettings({ hPadding: Math.max(0.75, Math.min(3, hPadding)) });
  }, [updateSettings]);

  return {
    settings,
    setTheme,
    setFontSize,
    setLineHeight,
    setMaxWidth,
    setHPadding,
  };
}
