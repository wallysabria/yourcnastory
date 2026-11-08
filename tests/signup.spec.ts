import { test, expect } from '@playwright/test';
import { signupSchema, submitSignup } from '../lib/signup';
const valid = {
  firstName: 'Test',
  lastName: 'Person',
  zip: '90210',
  email: 'test@example.invalid',
  sms: '',
  countryCode: '+1',
  language: 'en',
};
test('valid, existing, and unavailable signup transports are handled without external calls', async () => {
  let calls = 0;
  for (const state of ['created', 'existing'] as const) {
    const result = await submitSignup(valid, async () => {
      calls++;
      return state;
    });
    expect(result).toEqual({ status: 200, body: { code: 'mock', fields: [] } });
  }
  expect(calls).toBe(2);
  expect(
    (
      await submitSignup(valid, async () => {
        throw new Error('unavailable');
      })
    ).status,
  ).toBe(503);
});
test('invalid fields and honeypot never reach the transport', async () => {
  let calls = 0;
  const transport = async () => {
    calls++;
    return 'created' as const;
  };
  expect(
    (await submitSignup({ ...valid, email: 'invalid', zip: 'abc', language: 'vi' }, transport))
      .status,
  ).toBe(400);
  expect((await submitSignup({ ...valid, website: 'spam' }, transport)).status).toBe(200);
  expect(calls).toBe(0);
});
test('phone validation accepts national/full international input and enforces E164 length', () => {
  expect(signupSchema.safeParse({ ...valid, sms: '(213) 555-0123' }).success).toBe(true);
  expect(signupSchema.safeParse({ ...valid, sms: '+44 20 7946 0123' }).success).toBe(true);
  expect(signupSchema.safeParse({ ...valid, sms: '123' }).success).toBe(false);
  expect(
    signupSchema.safeParse({ ...valid, sms: '123456789012345', countryCode: '+1234' }).success,
  ).toBe(false);
});
