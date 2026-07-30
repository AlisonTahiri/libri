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
            initial={{ opacity: 0, scale: 0.92, y: above ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: above ? 10 : -10 }}
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
            <div className="bg-surface/80 backdrop-blur-[16px] border border-outline-variant/30 rounded-xl p-3 shadow-[0px_10px_30px_rgba(0,0,0,0.1)] max-w-[min(340px,85vw)] min-w-[120px]">
              <p className="font-body-reading text-[16px] leading-[1.55] text-on-surface m-0 break-words">
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
                      borderTop: '6px solid var(--color-surface)',
                      opacity: 0.8
                    }
                  : {
                      top: -6,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: '6px solid var(--color-surface)',
                      opacity: 0.8
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
