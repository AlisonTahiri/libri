import { motion, AnimatePresence } from 'framer-motion';
import { forwardRef } from 'react';

interface TranslationTooltipProps {
  visible: boolean;
  text: string;
  x: number;
  y: number;
  above: boolean;
}

export const TranslationTooltip = forwardRef<HTMLDivElement, TranslationTooltipProps>(
  ({ visible, text, x, y, above }, ref) => {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.92, y: above ? 8 : -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: above ? 8 : -8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350, mass: 0.8 }}
            style={{
              position: 'fixed',
              left: x,
              top: above ? y - 12 : y + 12,
              transform: `translateX(-50%) ${above ? 'translateY(-100%)' : ''}`,
              zIndex: 80,
              pointerEvents: 'auto',
            }}
          >
            <div
              style={{
                background: 'var(--tooltip-bg)',
                border: '1px solid var(--tooltip-border)',
                borderRadius: '10px',
                padding: '0.65rem 0.9rem',
                boxShadow: 'var(--tooltip-shadow)',
                maxWidth: 'min(340px, 85vw)',
                minWidth: '120px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--reader-font-family)',
                  fontSize: '0.92rem',
                  lineHeight: 1.55,
                  color: 'var(--tooltip-text)',
                  margin: 0,
                  wordBreak: 'break-word',
                }}
              >
                {text}
              </p>
            </div>

            {/* Arrow */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                ...(above
                  ? {
                      bottom: -6,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid var(--tooltip-bg)',
                    }
                  : {
                      top: -6,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: '6px solid var(--tooltip-bg)',
                    }),
                width: 0,
                height: 0,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

TranslationTooltip.displayName = 'TranslationTooltip';
