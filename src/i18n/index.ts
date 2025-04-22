import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// Import translations
import en from "~/i18n/locales/en.json";
import ru from "~/i18n/locales/ru.json";
import zh from "~/i18n/locales/zh.json";
import es from "~/i18n/locales/es.json";
import hi from "~/i18n/locales/hi.json";
import ar from "~/i18n/locales/ar.json";
import bn from "~/i18n/locales/bn.json";
import pt from "~/i18n/locales/pt.json";
import id from "~/i18n/locales/id.json";
import fr from "~/i18n/locales/fr.json";
import de from "~/i18n/locales/de.json";
import ja from "~/i18n/locales/ja.json";
import tr from "~/i18n/locales/tr.json";
import ko from "~/i18n/locales/ko.json";
import vi from "~/i18n/locales/vi.json";
import it from "~/i18n/locales/it.json";

const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
  zh: {
    translation: zh,
  },
  es: {
    translation: es,
  },
  hi: {
    translation: hi,
  },
  ar: {
    translation: ar,
  },
  bn: {
    translation: bn,
  },
  pt: {
    translation: pt,
  },
  id: {
    translation: id,
  },
  fr: {
    translation: fr,
  },
  de: {
    translation: de,
  },
  ja: {
    translation: ja,
  },
  tr: {
    translation: tr,
  },
  ko: {
    translation: ko,
  },
  vi: {
    translation: vi,
  },
  it: {
    translation: it,
  },
};

// Set default language if not set
if (!localStorage.getItem("i18nextLng")) {
  localStorage.setItem("i18nextLng", "en");
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
