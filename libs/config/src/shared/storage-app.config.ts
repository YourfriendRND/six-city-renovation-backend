import { registerAs } from '@nestjs/config';
import { validateConfig } from '@libs/config';
import { ApplicationConfigSchema } from '@libs/config/schemas';
import { NameSpaces, Environments } from '@libs/constants';

export default registerAs(NameSpaces.Storage, () => {
  return validateConfig(ApplicationConfigSchema, {
    environment: process.env.NODE_ENV ?? Environments.Development,
    port: parseInt(process.env.STORAGE_PORT, 10),
    homeUrl: process.env.HOME_URL,
    applicationHost: process.env.STORAGE_HOST,
  });
});
