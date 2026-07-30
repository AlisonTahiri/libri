import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const LANGUAGE_ABBREVIATIONS: Record<string, string> = {
  de: 'DE',
  en: 'EN',
  fr: 'FR',
  it: 'IT',
  es: 'ES',
  sq: 'SQ',
};

export function BookCard({ book, onClick }: BookCardProps) {
  const sourceLang = LANGUAGE_ABBREVIATIONS[book.source_language] || book.source_language.toUpperCase();
  const targetLang = LANGUAGE_ABBREVIATIONS[book.target_language] || book.target_language.toUpperCase();

  const isOriginal = book.author === 'Libri Originals';
  const displayTargetLang = isOriginal ? 'EN/SQ' : targetLang;
  const displayAuthor = isOriginal ? null : book.author;

  return (
    <article 
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="bg-surface-container-lowest rounded-xl p-3 flex flex-col gap-3 shadow-[0px_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0px_15px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300 group cursor-pointer border border-transparent hover:border-outline-variant/10"
    >
      <div className="w-full aspect-[2/3] rounded-lg overflow-hidden shadow-sm relative">
        <div className="absolute inset-0 bg-surface-variant flex items-center justify-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant opacity-30">book</span>
        </div>
      </div>
      <div className="flex flex-col px-1">
        <h3 className="font-body-reading text-[16px] font-semibold text-on-surface leading-tight mb-0.5 truncate" title={book.title}>
          {book.title}
        </h3>
        {displayAuthor && (
          <p className="font-ui-label-sm text-[11px] text-on-surface-variant truncate mb-2" title={displayAuthor}>
            {displayAuthor}
          </p>
        )}
        <div className="flex items-center gap-1.5 flex-wrap mt-auto">
          {isOriginal && (
            <span className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-[#5c3c00] shadow-sm font-ui-label-sm text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[10px]">auto_awesome</span>
              Originals
            </span>
          )}
          {book.level && (
            <span className="bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] text-white shadow-sm font-ui-label-sm text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {book.level}
            </span>
          )}
          <span className="bg-primary/10 text-primary font-ui-label-sm text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
            {sourceLang} &rarr; {displayTargetLang}
          </span>
          <span className="bg-secondary/15 text-secondary font-ui-label-sm text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
            {book.total_chapters} Kapituj
          </span>
        </div>
      </div>
    </article>
  );
}
