import {
  detectSignal,
  makeChoice,
  parseChoice,
  PRIVACY_KEY,
  type OptionalConsent,
  type ConsentChoice,
  type PrivacySignal,
} from './privacy-policy';

export type PrivacySnapshot = {
  ready: boolean;
  choice: ConsentChoice | null;
  signal: PrivacySignal;
  storageAvailable: boolean;
};
const initial: PrivacySnapshot = {
  ready: false,
  choice: null,
  signal: null,
  storageAvailable: true,
};
let state: PrivacySnapshot = initial;
const listeners = new Set<() => void>();
let listening = false;
export const getPrivacySnapshot = () => state;
export const getServerPrivacySnapshot = () => initial;
export function subscribePrivacy(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function publish(next: PrivacySnapshot) {
  state = next;
  listeners.forEach((listener) => listener());
}
function browserSignal() {
  return detectSignal(
    navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string },
  );
}
export function effectiveConsent(snapshot = state): OptionalConsent {
  return snapshot.ready &&
    !snapshot.signal &&
    snapshot.choice &&
    snapshot.choice.expiresAt > Date.now()
    ? { analytics: snapshot.choice.analytics, advertising: snapshot.choice.advertising }
    : { analytics: false, advertising: false };
}
export function savePrivacy(consent: OptionalConsent) {
  const signal = browserSignal();
  const choice = makeChoice(signal ? { analytics: false, advertising: false } : consent);
  let storageAvailable = true;
  try {
    localStorage.setItem(PRIVACY_KEY, JSON.stringify(choice));
  } catch {
    storageAvailable = false;
  }
  publish({ ready: true, choice, signal, storageAvailable });
}
export function hydratePrivacy() {
  const signal = browserSignal();
  let choice: ConsentChoice | null = null,
    storageAvailable = true;
  try {
    choice = parseChoice(localStorage.getItem(PRIVACY_KEY));
  } catch {
    storageAvailable = false;
  }
  if (signal) {
    choice = makeChoice({ analytics: false, advertising: false });
    try {
      localStorage.setItem(PRIVACY_KEY, JSON.stringify(choice));
    } catch {
      storageAvailable = false;
    }
  }
  publish({ ready: true, choice, signal, storageAvailable });
  if (!listening) {
    listening = true;
    window.addEventListener('storage', (event) => {
      if (event.key === PRIVACY_KEY || event.key === null) hydratePrivacy();
    });
    window.addEventListener('focus', () => {
      const next = browserSignal();
      if (next !== state.signal || (state.choice && state.choice.expiresAt <= Date.now()))
        hydratePrivacy();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const next = browserSignal();
        if (next !== state.signal || (state.choice && state.choice.expiresAt <= Date.now()))
          hydratePrivacy();
      }
    });
  }
}
export function openPrivacy() {
  window.dispatchEvent(new Event('ycna:open-privacy'));
}
