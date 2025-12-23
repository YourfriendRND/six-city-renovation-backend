import { registerAs } from '@nestjs/config';
import { NameSpaces, validateConfig, ConfirmationConfigSchema } from '@libs/config';

export default registerAs(NameSpaces.Confirmations, () => {
    return validateConfig(ConfirmationConfigSchema, {
        emailConfirmationExpiresIn: process.env.CONFIRMATION_EMAIL_EXPIRES_IN,
        emailConfirmationRetryByHour: process.env.CONFIRMATION_EMAIL_RETRY_BY_HOUR,
    });
});
