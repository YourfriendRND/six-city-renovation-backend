import { registerAs } from '@nestjs/config';
import { NameSpaces, validateConfig, StorageConfigSchema } from '@libs/config';

export default registerAs(NameSpaces.MinIo, () =>
  validateConfig(StorageConfigSchema, {
    userName: process.env.MINIO_ROOT_USER,
    password: process.env.MINIO_ROOT_PASSWORD,
    port: parseInt(process.env.MINIO_PORT, 10),
    consolePort: parseInt(process.env.MINIO_CONSOLE_PORT, 10),
    endpoint: process.env.MINIO_ENDPOINT,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    bucketName: process.env.MINIO_BUCKET_NAME,
  }),
);
