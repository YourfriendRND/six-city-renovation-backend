import { CookieOptions } from '@libs/types';

export function buildCookie(
  name: string,
  value: string,
  options: CookieOptions,
): string {
  return [
    `${name}=${value}`,
    ...Object.entries(options).map(([key, value]) => {
      if (key === 'expires' && value instanceof Date) {
        return `${key}=${value.toUTCString()}`;
      }
      return `${key}=${value}`;
    }),
  ].join('; ');
}
