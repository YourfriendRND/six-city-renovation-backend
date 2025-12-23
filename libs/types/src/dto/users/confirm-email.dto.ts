import { IsEmail, IsString } from "class-validator";

export class ConfirmEmailDTO {
    @IsEmail()
    @IsString()
    email: string;
}
