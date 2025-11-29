import { registerAs } from '@nestjs/config';
import { NameSpaces } from '@libs/constants';
import { JwtConfigSchema, validateConfig } from '@libs/config';

export default registerAs(NameSpaces.Jwt, () => {
  return validateConfig(JwtConfigSchema, {
    secret: process.env.APPLICATION_JWT_SECRET,
    expiresIn: process.env.APPLICATION_JWT_EXPIRES_IN,
    refreshSecret: process.env.APPLICATION_JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.APPLICATION_JWT_REFRESH_EXPIRES_IN,
    passwordSalt: process.env.PASSWORD_SALT,
    cookiePrefix: process.env.COOKIE_PREFIX,
  });
});
