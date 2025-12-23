import { registerAs } from "@nestjs/config";
import { validateConfig } from "@libs/config";
import { MailConfigSchema } from "@libs/config";
import { NameSpaces } from "@libs/config";

export default registerAs(NameSpaces.UserEmail, () => {
    return validateConfig(MailConfigSchema, {
        host: process.env.EMAIL_USER_HOST,
        port: process.env.EMAIL_USER_PORT,
        user: process.env.EMAIL_USER_EMAIL,
        password: process.env.EMAIL_USER_PASSWORD,
    })
})