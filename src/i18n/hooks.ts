import { useTranslation as useTranslationOriginal } from 'react-i18next';

export function useTranslation() {
  const { t, i18n } = useTranslationOriginal();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language,
  };
}