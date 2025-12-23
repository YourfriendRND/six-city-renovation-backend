import { randomBytes } from 'crypto';

export function generateOneTimeToken(min = 20, max = 200): string {
  const length = Math.floor(Math.random() * (max - min + 1)) + min;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  return randomBytes(length)
    .reduce((acc, byte) => acc + chars[byte % chars.length], '');
}
