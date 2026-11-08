export const PRIVACY_KEY = 'ycna_privacy_v1';
export const CHOICE_VERSION = 1;
export const CHOICE_LIFETIME = 180 * 24 * 60 * 60 * 1000;
export type PrivacySignal = 'gpc' | 'dnt' | null;
export type OptionalConsent = { analytics: boolean; advertising: boolean };
export type ConsentChoice = OptionalConsent & {
  version: number;
  updatedAt: number;
  expiresAt: number;
};
export function makeChoice(consent: OptionalConsent, now = Date.now()): ConsentChoice {
  return {
    version: CHOICE_VERSION,
    analytics: consent.analytics === true,
    advertising: consent.advertising === true,
    updatedAt: now,
    expiresAt: now + CHOICE_LIFETIME,
  };
}
export function parseChoice(raw: string | null, now = Date.now()): ConsentChoice | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (
      !value ||
      typeof value !== 'object' ||
      Array.isArray(value) ||
      value.version !== CHOICE_VERSION ||
      typeof value.analytics !== 'boolean' ||
      typeof value.advertising !== 'boolean' ||
      !Number.isFinite(value.updatedAt) ||
      !Number.isFinite(value.expiresAt) ||
      value.updatedAt < 0 ||
      value.updatedAt > now + 300000 ||
      value.expiresAt <= now ||
      value.expiresAt - value.updatedAt !== CHOICE_LIFETIME
    )
      return null;
    return {
      version: CHOICE_VERSION,
      analytics: value.analytics,
      advertising: value.advertising,
      updatedAt: value.updatedAt,
      expiresAt: value.expiresAt,
    };
  } catch {
    return null;
  }
}
export function detectSignal(nav: {
  globalPrivacyControl?: boolean;
  doNotTrack?: string | null;
  msDoNotTrack?: string | null;
}): PrivacySignal {
  if (nav.globalPrivacyControl === true) return 'gpc';
  if (['1', 'yes'].includes(nav.doNotTrack || nav.msDoNotTrack || '')) return 'dnt';
  return null;
}
export function consentSignals(consent: OptionalConsent) {
  return {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.advertising ? 'granted' : 'denied',
    ad_user_data: consent.advertising ? 'granted' : 'denied',
    ad_personalization: consent.advertising ? 'granted' : 'denied',
  } as const;
}
export type TrackingConfig = {
  mode: 'off' | 'mock' | 'production';
  containerId: string;
  allowedHosts: string[];
};
export function resolveTrackingMode(input: {
  requested?: string;
  environment?: string;
  launch?: string;
  verified?: string;
  liveApproved?: string;
}): TrackingConfig['mode'] {
  if (!input.requested || input.requested === 'mock') return 'mock';
  if (
    input.requested === 'production' &&
    input.environment === 'production' &&
    input.launch === 'true' &&
    input.verified === 'true' &&
    input.liveApproved === 'true'
  )
    return 'production';
  return 'off';
}
