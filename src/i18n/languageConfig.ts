// English namespaces
import enCommon from './locales/en/common.json';
import enOnboarding from './locales/en/onboarding.json';
import enHome from './locales/en/Home.json';
import enAuth from './locales/en/auth.json';

// French namespaces
import frCommon from './locales/fr/common.json';
import frOnboarding from './locales/fr/onboarding.json';
import frHome from './locales/fr/Home.json';
import frAuth from './locales/fr/auth.json';

export const defaultLanguage = 'en';

export const languagesResources = {
  en: {
    common: enCommon,
    onboarding: enOnboarding,
    Home: enHome,
    auth: enAuth,
  },
  fr: {
    common: frCommon,
    onboarding: frOnboarding,
    Home: frHome,
    auth: frAuth,
  },
};
