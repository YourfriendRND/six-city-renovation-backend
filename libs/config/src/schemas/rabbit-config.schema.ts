import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class RabbitConfigSchema {
  @IsString()
  host: string;

  @IsInt()
  @Transform(({ value }) => Number(value))
  port: number;

  @IsString()
  user: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  vhost?: string;

  @IsString()
  url: string;
}
