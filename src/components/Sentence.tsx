import { useCallback, memo } from 'react';

interface SentenceProps {
  id: string;
  text: string;
  translation: string;
  isActive: boolean;
  onTap: (id: string, translation: string, element: HTMLElement) => void;
}

export const Sentence = memo(function Sentence({ id, text, translation, isActive, onTap }: SentenceProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      onTap(id, translation, e.currentTarget);
    },
    [id, translation, onTap]
  );

  return (
    <span
      className={`cursor-pointer rounded-[3px] transition-all duration-200 ease-in-out py-[1px] px-0 [-webkit-tap-highlight-color:transparent] hover:bg-primary/15 ${isActive ? 'bg-primary/25 ring-2 ring-primary/40' : ''}`}
      onClick={handleClick}
      data-sentence-id={id}
      role="button"
      tabIndex={0}
      aria-label={`Tap to translate: ${text.slice(0, 40)}...`}
    >
      {text}
    </span>
  );
});
