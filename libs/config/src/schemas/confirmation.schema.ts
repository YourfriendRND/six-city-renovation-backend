import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { IsCorrectTime } from '../common';

export class ConfirmationConfigSchema {
    @IsString()
    @IsNotEmpty()
    @IsCorrectTime()
    emailConfirmationExpiresIn: string;

    @IsInt()
    @IsNotEmpty()
    emailConfirmationRetryByHour: number;
}
