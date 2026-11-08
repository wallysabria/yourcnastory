import destinations from '@/content/integrations/tracking-destinations.json';
import { resolveTrackingMode, type TrackingConfig } from './privacy-policy';
export function trackingConfig(): TrackingConfig {
  return {
    mode: resolveTrackingMode({
      requested: process.env.TRACKING_MODE,
      environment: process.env.VERCEL_ENV,
      launch: process.env.SITE_LAUNCH_APPROVED,
      verified: process.env.GTM_CONFIGURATION_VERIFIED,
      liveApproved: process.env.TRACKING_LIVE_APPROVED,
    }),
    containerId: destinations.containerId,
    allowedHosts: destinations.productionHosts,
  };
}
