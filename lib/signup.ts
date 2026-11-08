import { z } from 'zod';
export const signupSchema = z
  .object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    zip: z
      .string()
      .trim()
      .regex(/^\d{5}(?:-\d{4})?$/),
    email: z.email().max(254),
    sms: z.string().max(30).optional().default(''),
    countryCode: z
      .string()
      .regex(/^\+[1-9]\d{0,3}$/)
      .default('+1'),
    language: z.enum(['en', 'es']),
    website: z.string().max(200).optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (data.sms) {
      const digits = data.sms.replace(/[\s().-]/g, '');
      const full = digits.startsWith('+') ? digits : data.countryCode + digits;
      if (!/^\+[1-9]\d{6,14}$/.test(full))
        ctx.addIssue({ code: 'custom', path: ['sms'], message: 'invalid' });
    }
  });
export type SignupInput = z.infer<typeof signupSchema>;
export type SignupTransport = (input: SignupInput) => Promise<'created' | 'existing'>;
export async function submitSignup(raw: unknown, transport?: SignupTransport) {
  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success)
    return {
      status: 400,
      body: {
        code: 'invalid',
        fields: [...new Set(parsed.error.issues.map((issue) => String(issue.path[0])))],
      },
    };
  if (parsed.data.website) return { status: 200, body: { code: 'mock', fields: [] } };
  try {
    if (transport) await transport(parsed.data);
    return { status: 200, body: { code: 'mock', fields: [] } };
  } catch {
    return { status: 503, body: { code: 'unavailable', fields: [] } };
  }
}
