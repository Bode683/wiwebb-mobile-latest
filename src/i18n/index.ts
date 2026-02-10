import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { defaultLanguage, languagesResources } from './languageConfig';
import RNLanguageDetector from './languageDetector';

i18n
  .use(RNLanguageDetector as any)
  .use(initReactI18next)
  .init({
    debug: __DEV__,
    resources: languagesResources,
    fallbackLng: defaultLanguage,

    ns: ['common', 'onboarding', 'Home'],
    defaultNS: 'common',

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
