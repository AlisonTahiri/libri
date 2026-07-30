import { useLanguage } from '../hooks/useLanguage';
import { UsFlag, AlFlag } from './FlagIcons';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setLanguage(language === 'en' ? 'sq' : 'en');
      }}
      className="flex items-center justify-center px-3 h-10 bg-transparent border border-outline-variant/30 rounded-full text-on-surface hover:bg-surface-variant/30 transition-colors cursor-pointer font-ui-button text-ui-button"
      aria-label={t('language')}
    >
      {language === 'en' ? (
        <span className="flex items-center gap-1.5"><UsFlag /> EN</span>
      ) : (
        <span className="flex items-center gap-1.5"><AlFlag /> SQ</span>
      )}
    </button>
  );
}
