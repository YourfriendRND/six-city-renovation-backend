import { IsPort, IsString } from 'class-validator';

export class MailConfigSchema {
  @IsString()
  host: string;

  @IsPort()
  port: string;

  @IsString()
  user: string;

  @IsString()
  password: string;
}
