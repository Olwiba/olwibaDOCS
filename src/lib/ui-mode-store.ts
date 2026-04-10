type Subscriber = (mode: string) => void;

const STORAGE_KEY = 'olwiba-ui-mode';

function getInitialMode(): string {
  if (typeof window === 'undefined') return 'default';
  return localStorage.getItem(STORAGE_KEY) ?? 'default';
}

let current: string = getInitialMode();
const subscribers = new Set<Subscriber>();

export function getUIMode(): string {
  return current;
}

export function setUIMode(mode: string) {
  current = mode;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, mode);
  }
  subscribers.forEach((fn) => fn(mode));
}

export function subscribeUIMode(fn: Subscriber): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}
