import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
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
          <motion.div
            className="panel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="settings-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="panel-handle" />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}>
              <h3 style={{
                fontFamily: 'var(--reader-font-family)',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
              }}>
                Kapitujt
              </h3>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="safe-bottom" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {chapters.map((ch) => (
                <div
                  key={ch.id}
                  className={`chapter-item ${currentChapterId === ch.id ? 'active' : ''}`}
                  onClick={() => {
                    onSelectChapter(ch.id);
                    onClose();
                  }}
                >
                  <span className="chapter-number">{ch.chapter_number}</span>
                  <span>{ch.title || `Kapitulli ${ch.chapter_number}`}</span>
                </div>
              ))}

              {chapters.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
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
