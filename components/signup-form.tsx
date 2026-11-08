'use client';
import { useRef, useState, type ReactNode } from 'react';
import type { Locale } from '@/lib/content-schema';
import { signupSchema } from '@/lib/signup';
import messages from '@/content/ui/signup.json';
const names: Record<string, string> = {
  firstName: 'FNAME',
  lastName: 'LNAME',
  zip: 'MMERGE4',
  email: 'EMAIL',
  sms: 'SMSPHONE',
  language: 'MMERGE3',
  countryCode: 'countryCode',
};
export function SignupForm({ locale, children }: { locale: Locale; children: ReactNode }) {
  const form = useRef<HTMLFormElement>(null),
    busy = useRef(false);
  const [state, setState] = useState<
      'idle' | 'pending' | 'accepted' | 'invalid' | 'unavailable' | 'limited'
    >('idle'),
    [errors, setErrors] = useState<string[]>([]),
    [touched, setTouched] = useState(false);
  const t = messages[locale];
  function markErrors(fields: string[]) {
    setErrors(fields);
    for (const [field, name] of Object.entries(names)) {
      form.current?.querySelectorAll('[name="' + name + '"]').forEach((input) => {
        input.setAttribute('aria-invalid', String(fields.includes(field)));
        if (fields.includes(field)) input.setAttribute('aria-describedby', 'signup-error-' + field);
        else input.removeAttribute('aria-describedby');
      });
    }
    const first = form.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    first?.focus();
  }
  return (
    <form
      id="mc-embedded-subscribe-form"
      className="validate native-signup"
      ref={form}
      data-pagefind-ignore
      noValidate
      onChangeCapture={() => setTouched(true)}
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy.current) return;
        const data = new FormData(event.currentTarget);
        const input = {
          firstName: String(data.get('FNAME') || ''),
          lastName: String(data.get('LNAME') || ''),
          zip: String(data.get('MMERGE4') || ''),
          email: String(data.get('EMAIL') || ''),
          sms: String(data.get('SMSPHONE') || ''),
          countryCode: String(data.get('countryCode') || '+1'),
          language:
            data.get('MMERGE3') === 'English'
              ? 'en'
              : data.get('MMERGE3') === 'Español'
                ? 'es'
                : '',
          website: String(data.get('website') || ''),
        };
        const parsed = signupSchema.safeParse(input);
        if (!parsed.success) {
          markErrors([...new Set(parsed.error.issues.map((issue) => String(issue.path[0])))]);
          setState('invalid');
          return;
        }
        busy.current = true;
        setState('pending');
        markErrors([]);
        try {
          const response = await fetch('/api/signup/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed.data),
          });
          const result = await response.json();
          if (response.ok) {
            setState('accepted');
            window.dispatchEvent(
              new CustomEvent('signup_submitted', {
                detail: { language: parsed.data.language, mode: 'mock' },
              }),
            );
          } else if (response.status === 429) setState('limited');
          else if (response.status === 400) {
            markErrors(result.fields || []);
            setState('invalid');
          } else setState('unavailable');
        } catch {
          setState('unavailable');
        } finally {
          busy.current = false;
        }
      }}
    >
      <fieldset disabled={state === 'pending'} className="native-form-fields">
        {children}
      </fieldset>
      <div className="native-form-feedback" data-pagefind-ignore data-content-control>
        {touched && state === 'idle' && (
          <p className="native-mock-notice" role="status">
            {t.preview}
          </p>
        )}
        <p
          role={['invalid', 'unavailable', 'limited'].includes(state) ? 'alert' : 'status'}
          aria-live="polite"
        >
          {state === 'idle' ? '' : t[state]}
        </p>
        {errors.length > 0 && (
          <ul>
            {errors.map((field) => (
              <li id={'signup-error-' + field} key={field}>
                {field === 'firstName' || field === 'lastName'
                  ? t.name
                  : field === 'zip'
                    ? t.zip
                    : field === 'email'
                      ? t.email
                      : field === 'sms' || field === 'countryCode'
                        ? t.phone
                        : field === 'language'
                          ? t.language
                          : t.required}
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}

export function CountryCode({ locale }: { locale: Locale }) {
  return (
    <input
      type="tel"
      name="countryCode"
      className="native-country-code"
      defaultValue="+1"
      aria-label={messages[locale].countryCode}
      inputMode="tel"
      autoComplete="tel-country-code"
      maxLength={5}
    />
  );
}
