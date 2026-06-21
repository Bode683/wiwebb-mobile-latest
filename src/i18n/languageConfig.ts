// English namespaces
import enCommon from './locales/en/common.json';
import enOnboarding from './locales/en/onboarding.json';
import enHome from './locales/en/Home.json';
import enAuth from './locales/en/auth.json';
import enSettings from './locales/en/settings.json';
import enUsers from './locales/en/users.json';
import enSites from './locales/en/sites.json';

// French namespaces
import frCommon from './locales/fr/common.json';
import frOnboarding from './locales/fr/onboarding.json';
import frHome from './locales/fr/Home.json';
import frAuth from './locales/fr/auth.json';
import frSettings from './locales/fr/settings.json';
import frUsers from './locales/fr/users.json';
import frSites from './locales/fr/sites.json';

export const defaultLanguage = 'en';

export const languagesResources = {
  en: {
    common: enCommon,
    onboarding: enOnboarding,
    Home: enHome,
    auth: enAuth,
    settings: enSettings,
    users: enUsers,
    sites: enSites,
  },
  fr: {
    common: frCommon,
    onboarding: frOnboarding,
    Home: frHome,
    auth: frAuth,
    settings: frSettings,
    users: frUsers,
    sites: frSites,
  },
};
