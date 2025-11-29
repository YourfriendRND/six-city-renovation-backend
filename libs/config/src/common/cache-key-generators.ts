export function createSessionCacheKey(
  prefix: string,
  sessionId: string,
): string {
  return `${prefix}:session:${sessionId}`;
}
