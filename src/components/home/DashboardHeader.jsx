import React from 'react';
import { ScreenHeader } from '../ScreenHeader';

/**
 * Dashboard tab header — wraps ScreenHeader with the dashboard variant.
 * Site name and subtitle will be wired to Redux state once that slice exists.
 */
export const DashboardHeader = () => (
  <ScreenHeader
    variant="dashboard"
    title="Dashboard"
    siteName="Default Site"
    siteSubtitle="Central Essential"
  />
);
