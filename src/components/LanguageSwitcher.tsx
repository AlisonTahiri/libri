
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
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 10px',
        height: '38px',
        background: 'transparent',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        fontFamily: 'var(--ui-font-family)',
        fontSize: '0.85rem',
        fontWeight: 600,
      }}
      aria-label={t('language')}
    >
      {language === 'en' ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><UsFlag /> EN</span>
      ) : (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlFlag /> SQ</span>
      )}
    </button>
  );
}
