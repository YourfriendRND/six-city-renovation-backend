export function extractJwtFromCookie(
  key: string,
): (req: unknown) => string | null {
  return function (req: unknown): string | null {
    if (typeof req === 'object') {
      if ('headers' in req && typeof req.headers === 'object') {
        if ('cookie' in req.headers && typeof req.headers.cookie === 'string') {
          const cookieString = req.headers.cookie;

          if (!cookieString) {
            return null;
          }

          const jwtToken = cookieString
            .split('; ')
            .find((cookie) => cookie.startsWith(key))
            ?.split('=')[1];

          return jwtToken;
        }
      }
    }

    return null;
  };
}
