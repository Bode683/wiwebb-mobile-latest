// English namespaces
import enCommon from './locales/en/common.json';
import enOnboarding from './locales/en/onboarding.json';
import enHome from './locales/en/Home.json';
import enAuth from './locales/en/auth.json';
import enSettings from './locales/en/settings.json';
import enUsers from './locales/en/users.json';
import enSites from './locales/en/sites.json';
import enDevices from './locales/en/devices.json';
import enPlans from './locales/en/plans.json';
import enPaymentProviders from './locales/en/payment-providers.json';
import enOrders from './locales/en/orders.json';

// French namespaces
import frCommon from './locales/fr/common.json';
import frOnboarding from './locales/fr/onboarding.json';
import frHome from './locales/fr/Home.json';
import frAuth from './locales/fr/auth.json';
import frSettings from './locales/fr/settings.json';
import frUsers from './locales/fr/users.json';
import frSites from './locales/fr/sites.json';
import frDevices from './locales/fr/devices.json';
import frPlans from './locales/fr/plans.json';
import frPaymentProviders from './locales/fr/payment-providers.json';
import frOrders from './locales/fr/orders.json';

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
    devices: enDevices,
    plans: enPlans,
    'payment-providers': enPaymentProviders,
    orders: enOrders,
  },
  fr: {
    common: frCommon,
    onboarding: frOnboarding,
    Home: frHome,
    auth: frAuth,
    settings: frSettings,
    users: frUsers,
    sites: frSites,
    devices: frDevices,
    plans: frPlans,
    'payment-providers': frPaymentProviders,
    orders: frOrders,
  },
};
