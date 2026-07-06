// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, max = 5, windowMs = 60_000) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= max) return false;

  current.count += 1;
  return true;
}
