import { useCallback } from 'react';
import { Sentence } from './Sentence';
import type { ParagraphWithSentences } from '../types';

interface ReaderContentProps {
  paragraphs: ParagraphWithSentences[];
  activeSentenceId: string | null;
  onSentenceTap: (id: string, translation: string, element: HTMLElement) => void;
}

export function ReaderContent({ paragraphs, activeSentenceId, onSentenceTap }: ReaderContentProps) {
  const handleTap = useCallback(
    (id: string, translation: string, element: HTMLElement) => {
      onSentenceTap(id, translation, element);
    },
    [onSentenceTap]
  );

  if (paragraphs.length === 0) {
    return (
      <div className="reader-content">
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Ky kapitull nuk ka përmbajtje ende.
        </p>
      </div>
    );
  }

  return (
    <div className="reader-content">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.id} className="reader-paragraph">
          {paragraph.sentences.map((sentence, idx) => (
            <span key={sentence.id}>
              {idx > 0 && ' '}
              <Sentence
                id={sentence.id}
                text={sentence.original_text}
                translation={sentence.translated_text}
                isActive={activeSentenceId === sentence.id}
                onTap={handleTap}
              />
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
