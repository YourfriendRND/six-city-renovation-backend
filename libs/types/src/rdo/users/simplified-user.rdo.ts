import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Roles } from '@libs/constants';

export class SimplifiedUserRdo {
  @Expose()
  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: '55a477df-bf7e-4470-a23e-ea374bdb8618',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Admin',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Флаг характеризующий премиум аккаунт у пользователя',
    example: true,
  })
  isPro: boolean;

  @Expose()
  @ApiProperty({
    description: 'url аватара пользователя',
    example: 'https://example.com',
  })
  avatarUrl: string;

  @ApiProperty({
    description: 'Роль пользователя',
    example: Roles.User,
    enum: Roles,
  })
  @Expose()
  role: Roles;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Дата последнего посещения',
    example: '2025-08-28T16:55:42.803Z',
  })
  @Expose()
  lastLoginAt: Date;
}
