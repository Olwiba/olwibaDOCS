// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
type Subscriber = (code: string | null) => void

const store = new Map<string, string | null>()
const subscribers = new Map<string, Set<Subscriber>>()

export function setUsageCode(name: string, code: string | null) {
  store.set(name, code)
  subscribers.get(name)?.forEach(fn => fn(code))
}

export function subscribeUsageCode(name: string, fn: Subscriber) {
  if (!subscribers.has(name)) subscribers.set(name, new Set())
  subscribers.get(name)!.add(fn)
  return () => {
    subscribers.get(name)?.delete(fn)
  }
}

export function getUsageCode(name: string) {
  return store.get(name) ?? null
}
