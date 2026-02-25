import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from "./i18n/en.json";
import ee from "./i18n/ee.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      et: { translation: ee },
    },
    lng: localStorage.getItem('keel') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n