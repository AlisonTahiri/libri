import { motion, AnimatePresence } from 'framer-motion';
import type { Chapter } from '../types';

interface ChapterNavProps {
  open: boolean;
  onClose: () => void;
  chapters: Chapter[];
  currentChapterId: string | null;
  onSelectChapter: (chapterId: string) => void;
}

export function ChapterNav({
  open,
  onClose,
  chapters,
  currentChapterId,
  onSelectChapter,
}: ChapterNavProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-inverse-surface/20 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed bottom-0 left-0 w-full z-[101] bg-surface/90 backdrop-blur-2xl border-t border-outline-variant/20 rounded-t-[24px] shadow-[0px_-20px_40px_rgba(0,0,0,0.1)] flex flex-col max-h-[85vh]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full" />
            </div>

            <div className="px-6 pb-4 flex justify-between items-center border-b border-outline-variant/20">
              <h3 className="font-ui-header text-[18px] text-on-surface m-0">
                Kapitujt
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="px-4 py-2 pb-safe overflow-y-auto hide-scrollbar flex-1 flex flex-col gap-1">
              {chapters.map((ch) => {
                const isActive = currentChapterId === ch.id;
                return (
                  <div
                    key={ch.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      isActive 
                        ? 'bg-primary-container/20 text-primary' 
                        : 'text-on-surface hover:bg-surface-variant/30'
                    }`}
                    onClick={() => {
                      onSelectChapter(ch.id);
                      onClose();
                    }}
                  >
                    <span className="font-ui-label-sm w-6 text-center opacity-70">{ch.chapter_number}</span>
                    <span className="font-body-reading text-[16px] truncate flex-1">
                      {ch.title || `Kapitulli ${ch.chapter_number}`}
                    </span>
                    {isActive && (
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    )}
                  </div>
                );
              })}

              {chapters.length === 0 && (
                <p className="text-on-surface-variant text-sm text-center p-4">
                  Nuk ka kapituj.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
