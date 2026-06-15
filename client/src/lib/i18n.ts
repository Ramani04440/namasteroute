import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "@shared/constants";

// Import translation files
import en from "../locales/en.json";
import hi from "../locales/hi.json";
import ta from "../locales/ta.json";
import bn from "../locales/bn.json";
import te from "../locales/te.json";

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  ta: { translation: ta },
  bn: { translation: bn },
  te: { translation: te },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: SUPPORTED_LANGUAGES.ENGLISH,
    fallbackLng: SUPPORTED_LANGUAGES.ENGLISH,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
