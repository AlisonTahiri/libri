import { motion, AnimatePresence } from 'framer-motion';
import type { Theme, ReaderSettings } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Sun, Moon, Coffee, Type, AlignJustify, MoveHorizontal, Indent, Maximize, Minimize, ArrowLeft } from 'lucide-react';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onSetTheme: (theme: Theme) => void;
  onSetFontSize: (size: number) => void;
  onSetLineHeight: (lh: number) => void;
  onSetMaxWidth: (mw: number) => void;
  onSetHPadding: (hp: number) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onBackToLibrary?: () => void;
}

export function SettingsPanel({
  open,
  onClose,
  settings,
  onSetTheme,
  onSetFontSize,
  onSetLineHeight,
  onSetMaxWidth,
  onSetHPadding,
  isFullscreen,
  onToggleFullscreen,
  onBackToLibrary,
}: SettingsPanelProps) {
  const { t } = useLanguage();

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
            className="fixed bottom-0 left-0 w-full z-[101] bg-surface/90 backdrop-blur-2xl border-t border-outline-variant/20 rounded-t-[24px] shadow-[0px_-20px_40px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full" />
            </div>

            <div className="px-6 pb-safe overflow-y-auto hide-scrollbar flex-1">
              <div className="flex flex-col gap-6 py-4 max-w-lg mx-auto">
                
                {/* Language */}
                <div className="flex flex-col gap-3">
                  <span className="font-ui-label-sm text-ui-label-sm text-outline uppercase">{t('language')}</span>
                  <div className="flex gap-2">
                    <LanguageSwitcher />
                  </div>
                </div>

                {/* Theme Switcher */}
                <div className="flex flex-col gap-3">
                  <span className="font-ui-label-sm text-ui-label-sm text-outline uppercase">{t('theme')}</span>
                  <div className="flex bg-surface-container-highest p-1 rounded-xl">
                    <button
                      onClick={() => onSetTheme('light')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-ui-button text-ui-button transition-colors ${settings.theme === 'light' ? 'bg-surface text-on-surface shadow-sm border border-outline-variant/50' : 'text-on-surface-variant hover:bg-surface-variant/50 border border-transparent'}`}
                    >
                      <Sun className="w-[18px] h-[18px]" />
                      {t('light')}
                    </button>
                    <button
                      onClick={() => onSetTheme('dark')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-ui-button text-ui-button transition-colors ${settings.theme === 'dark' ? 'bg-primary text-on-primary shadow-sm border border-primary' : 'text-on-surface-variant hover:bg-surface-variant/50 border border-transparent'}`}
                    >
                      <Moon className="w-[18px] h-[18px]" />
                      {t('dark')}
                    </button>
                    <button
                      onClick={() => onSetTheme('sepia')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-ui-button text-ui-button transition-colors ${settings.theme === 'sepia' ? 'bg-surface text-on-surface shadow-sm border border-outline-variant/80' : 'text-on-surface-variant hover:bg-surface-variant/50 border border-transparent'}`}
                    >
                      <Coffee className="w-[18px] h-[18px]" />
                      {t('sepia')}
                    </button>
                  </div>
                </div>

                {/* Font Size */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-ui-label-sm text-ui-label-sm text-outline uppercase">{t('textSize')}</span>
                    <span className="font-ui-label-sm text-on-surface-variant">{settings.fontSize}px</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Type className="w-4 h-4 text-on-surface-variant" />
                    <input
                      type="range"
                      min={14}
                      max={28}
                      step={1}
                      value={settings.fontSize}
                      onChange={(e) => onSetFontSize(Number(e.target.value))}
                      className="flex-1 accent-primary h-1.5 bg-surface-variant rounded-full appearance-none outline-none cursor-pointer"
                    />
                    <Type className="w-6 h-6 text-on-surface-variant" />
                  </div>
                </div>

                {/* Line Height */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-ui-label-sm text-ui-label-sm text-outline uppercase">{t('lineHeight')}</span>
                    <span className="font-ui-label-sm text-on-surface-variant">{settings.lineHeight.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <AlignJustify className="w-[18px] h-[18px] text-on-surface-variant" />
                    <input
                      type="range"
                      min={1.4}
                      max={2.4}
                      step={0.1}
                      value={settings.lineHeight}
                      onChange={(e) => onSetLineHeight(Number(e.target.value))}
                      className="flex-1 accent-primary h-1.5 bg-surface-variant rounded-full appearance-none outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Max Width */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-ui-label-sm text-ui-label-sm text-outline uppercase">{t('pageWidth')}</span>
                    <span className="font-ui-label-sm text-on-surface-variant">{settings.maxWidth}px</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <MoveHorizontal className="w-[18px] h-[18px] text-on-surface-variant" />
                    <input
                      type="range"
                      min={520}
                      max={800}
                      step={20}
                      value={settings.maxWidth}
                      onChange={(e) => onSetMaxWidth(Number(e.target.value))}
                      className="flex-1 accent-primary h-1.5 bg-surface-variant rounded-full appearance-none outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Horizontal Padding */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-ui-label-sm text-ui-label-sm text-outline uppercase">{t('sideMargins')}</span>
                    <span className="font-ui-label-sm text-on-surface-variant">{settings.hPadding.toFixed(1)}rem</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Indent className="w-[18px] h-[18px] text-on-surface-variant" />
                    <input
                      type="range"
                      min={0.75}
                      max={3}
                      step={0.25}
                      value={settings.hPadding}
                      onChange={(e) => onSetHPadding(Number(e.target.value))}
                      className="flex-1 accent-primary h-1.5 bg-surface-variant rounded-full appearance-none outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 mt-2 border-t border-outline-variant/20 pt-6">
                  {onToggleFullscreen && (
                    <button
                      onClick={onToggleFullscreen}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl border border-outline-variant/30 text-on-surface hover:bg-surface-variant/30 transition-colors font-ui-button text-ui-button w-full"
                    >
                      {isFullscreen ? <Minimize className="w-[18px] h-[18px]" /> : <Maximize className="w-[18px] h-[18px]" />}
                      {isFullscreen ? t('exitFullscreen') : t('fullscreen')}
                    </button>
                  )}

                  {onBackToLibrary && (
                    <button
                      onClick={() => { onBackToLibrary(); onClose(); }}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl border border-outline-variant/30 text-on-surface hover:bg-surface-variant/30 transition-colors font-ui-button text-ui-button w-full"
                    >
                      <ArrowLeft className="w-[18px] h-[18px]" />
                      {t('back')}
                    </button>
                  )}
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
