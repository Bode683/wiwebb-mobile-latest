// English namespaces
import enCommon from './locales/en/common.json';
import enOnboarding from './locales/en/onboarding.json';
import enHome from './locales/en/Home.json';

// French namespaces
import frCommon from './locales/fr/common.json';
import frOnboarding from './locales/fr/onboarding.json';
import frHome from './locales/fr/Home.json';

export const defaultLanguage = 'en';

export const languagesResources = {
  en: {
    common: enCommon,
    onboarding: enOnboarding,
    Home: enHome,
  },
  fr: {
    common: frCommon,
    onboarding: frOnboarding,
    Home: frHome,
  },
};
