import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Coffee,
  Type,
  AlignVerticalSpaceAround,
  Maximize,
  Minimize,
  ArrowLeft,
} from 'lucide-react';
import type { Theme, ReaderSettings } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageSwitcher } from './LanguageSwitcher';

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
            className="panel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="settings-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="panel-handle" />

            <div className="safe-bottom">
              {/* Language */}
              <div className="panel-section">
                <div className="panel-section-title">{t('language')}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <LanguageSwitcher />
                </div>
              </div>

              {/* Theme */}
              <div className="panel-section">
                <div className="panel-section-title">{t('theme')}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className={`theme-btn theme-btn-dark ${settings.theme === 'dark' ? 'active' : ''}`}
                    onClick={() => onSetTheme('dark')}
                  >
                    <Moon size={14} style={{ marginRight: 4, verticalAlign: -2 }} />
                    Dark
                  </button>
                  <button
                    className={`theme-btn theme-btn-light ${settings.theme === 'light' ? 'active' : ''}`}
                    onClick={() => onSetTheme('light')}
                  >
                    <Sun size={14} style={{ marginRight: 4, verticalAlign: -2 }} />
                    Light
                  </button>
                  <button
                    className={`theme-btn theme-btn-sepia ${settings.theme === 'sepia' ? 'active' : ''}`}
                    onClick={() => onSetTheme('sepia')}
                  >
                    <Coffee size={14} style={{ marginRight: 4, verticalAlign: -2 }} />
                    {t('sepia')}
                  </button>
                </div>
              </div>

              {/* Font Size */}
              <div className="panel-section">
                <div className="panel-section-title">
                  <Type size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
                  {t('textSize')} — {settings.fontSize}px
                </div>
                <input
                  type="range"
                  className="custom-slider"
                  min={14}
                  max={28}
                  step={1}
                  value={settings.fontSize}
                  onChange={(e) => onSetFontSize(Number(e.target.value))}
                />
              </div>

              {/* Line Height */}
              <div className="panel-section">
                <div className="panel-section-title">
                  <AlignVerticalSpaceAround size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
                  {t('lineHeight')} — {settings.lineHeight.toFixed(1)}
                </div>
                <input
                  type="range"
                  className="custom-slider"
                  min={1.4}
                  max={2.4}
                  step={0.1}
                  value={settings.lineHeight}
                  onChange={(e) => onSetLineHeight(Number(e.target.value))}
                />
              </div>

              {/* Max Width */}
              <div className="panel-section">
                <div className="panel-section-title">
                  {t('pageWidth')} — {settings.maxWidth}px
                </div>
                <input
                  type="range"
                  className="custom-slider"
                  min={520}
                  max={800}
                  step={20}
                  value={settings.maxWidth}
                  onChange={(e) => onSetMaxWidth(Number(e.target.value))}
                />
              </div>

              {/* Horizontal Padding */}
              <div className="panel-section">
                <div className="panel-section-title">
                  {t('sideMargins')} — {settings.hPadding.toFixed(1)}rem
                </div>
                <input
                  type="range"
                  className="custom-slider"
                  min={0.75}
                  max={3}
                  step={0.25}
                  value={settings.hPadding}
                  onChange={(e) => onSetHPadding(Number(e.target.value))}
                />
              </div>

              {/* Actions */}
              <div className="panel-section" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {onToggleFullscreen && (
                  <button
                    onClick={onToggleFullscreen}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.7rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--ui-font-family)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                    {isFullscreen ? t('exitFullscreen') : t('fullscreen')}
                  </button>
                )}

                {onBackToLibrary && (
                  <button
                    onClick={() => { onBackToLibrary(); onClose(); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.7rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--ui-font-family)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <ArrowLeft size={16} />
                    {t('back')}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
