import { test, expect } from '@playwright/test';
import {
  makeChoice,
  parseChoice,
  detectSignal,
  consentSignals,
  resolveTrackingMode,
  CHOICE_LIFETIME,
} from '../lib/privacy-policy';
test('consent validation rejects corrupt, expired, future and unexpected-version records', () => {
  const now = 1900000000000;
  const choice = makeChoice({ analytics: true, advertising: false }, now);
  expect(parseChoice(JSON.stringify(choice), now)).toEqual(choice);
  for (const raw of [
    '{}',
    'null',
    'bad',
    JSON.stringify({ ...choice, version: 2 }),
    JSON.stringify({ ...choice, analytics: 'true' }),
    JSON.stringify({
      ...choice,
      updatedAt: now + 600000,
      expiresAt: now + 600000 + CHOICE_LIFETIME,
    }),
  ])
    expect(parseChoice(raw, now)).toBeNull();
  expect(parseChoice(JSON.stringify(choice), now + CHOICE_LIFETIME)).toBeNull();
});
test('GPC takes precedence over DNT and categories map independently', () => {
  expect(detectSignal({ globalPrivacyControl: true, doNotTrack: '1' })).toBe('gpc');
  expect(detectSignal({ doNotTrack: '1' })).toBe('dnt');
  expect(detectSignal({ doNotTrack: '0' })).toBeNull();
  expect(consentSignals({ analytics: true, advertising: false })).toEqual({
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  expect(consentSignals({ analytics: false, advertising: true }).analytics_storage).toBe('denied');
});
test('live mode requires every gate and never enables in previews', () => {
  const all = {
    requested: 'production',
    environment: 'production',
    launch: 'true',
    verified: 'true',
    liveApproved: 'true',
  };
  expect(resolveTrackingMode(all)).toBe('production');
  for (const field of ['environment', 'launch', 'verified', 'liveApproved'] as const)
    expect(resolveTrackingMode({ ...all, [field]: undefined })).toBe('off');
  expect(resolveTrackingMode({ ...all, environment: 'preview' })).toBe('off');
  expect(resolveTrackingMode({})).toBe('mock');
  expect(resolveTrackingMode({ requested: 'off' })).toBe('off');
});
