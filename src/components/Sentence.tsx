import { useCallback } from 'react';

interface SentenceProps {
  id: string;
  text: string;
  translation: string;
  isActive: boolean;
  onTap: (id: string, translation: string, element: HTMLElement) => void;
}

export function Sentence({ id, text, translation, isActive, onTap }: SentenceProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      onTap(id, translation, e.currentTarget);
    },
    [id, translation, onTap]
  );

  return (
    <span
      className={`sentence${isActive ? ' active' : ''}`}
      onClick={handleClick}
      data-sentence-id={id}
      role="button"
      tabIndex={0}
      aria-label={`Tap to translate: ${text.slice(0, 40)}...`}
    >
      {text}
    </span>
  );
}
