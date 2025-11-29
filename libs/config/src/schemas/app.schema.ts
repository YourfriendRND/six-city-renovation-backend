import {
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsString,
  IsEnum,
} from 'class-validator';
import { Environments } from '../../../constants/src/enums';

export class ApplicationConfigSchema {
  @IsNotEmpty()
  @IsNumber()
  @Min(3000)
  @Max(65535)
  port: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Environments)
  environment: string;

  @IsString()
  homeUrl: string;

  @IsString()
  applicationHost: string;
}
