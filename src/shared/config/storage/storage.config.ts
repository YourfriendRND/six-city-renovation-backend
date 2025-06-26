import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min, IsString } from 'class-validator';

import { NameSpaces } from 'src/shared/constants';
import { validateConfig } from 'src/shared/common';

const MIN_PORT_VALUE = 0;
const MAX_PORT_VALUE = 65535;

class StorageConfig {
    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsNumber()
    @Min(MIN_PORT_VALUE) 
    @Max(MAX_PORT_VALUE)
    port?: number;

    @IsOptional()
    @IsNumber()
    @Min(MIN_PORT_VALUE) 
    @Max(MAX_PORT_VALUE)
    consolePort?: number;

    @IsNotEmpty()
    @IsString()
    endpoint: string;

    @IsNotEmpty()
    @IsString()
    accessKey: string;
    
    @IsNotEmpty()
    @IsString()
    secretKey: string;

    @IsNotEmpty()
    @IsString()
    bucketName: string;
}

export default registerAs(NameSpaces.Storage, () =>
    validateConfig(StorageConfig, ({
        userName: process.env.MINIO_ROOT_USER,
        password: process.env.MINIO_ROOT_PASSWORD,
        port: parseInt(process.env.MINIO_PORT, 10),
        consolePort: parseInt(process.env.MINIO_CONSOLE_PORT, 10),
        endpoint: process.env.MINIO_ENDPOINT,
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
        bucketName: process.env.MINIO_BUCKET_NAME,
    })),
);
