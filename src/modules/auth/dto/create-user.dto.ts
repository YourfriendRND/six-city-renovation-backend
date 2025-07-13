import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    example: 'Семен Семенович',
    description: 'Имя пользователя',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'Пароль пользователя',
  })
  @IsString()
  password: string;
}
