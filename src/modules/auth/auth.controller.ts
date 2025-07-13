import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDTO, LoginDTO } from './dto';
import { fillResponseDto } from 'src/shared/common';
import { SimplifiedUserRdo } from '../users/rdo';
import { ConflictExceptionRdo } from 'src/shared/exceptions';

@ApiTags('Регистрация/авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiBody({
    description: 'Набор данных для регистрации',
    type: CreateUserDTO,
  })
  @ApiOkResponse({
    description: 'Пользователь успешно зарегистрирован',
    type: SimplifiedUserRdo,
  })
  @ApiConflictResponse({
    type: ConflictExceptionRdo,
    description: 'Пользователь с таким email уже существует',
  })
  @Post('register')
  async register(@Body() dto: CreateUserDTO): Promise<SimplifiedUserRdo> {
    const user = await this.authService.register(dto);

    return fillResponseDto(SimplifiedUserRdo, user);
  }

  @ApiOperation({ summary: 'Авторизация' })
  @ApiBody({ type: LoginDTO })
  @Post('login')
  async login(@Body() _dto: LoginDTO) {
    throw new Error('Not implemented yet');
  }

  @ApiOperation({ summary: 'Выход из системы' })
  @Post('logout')
  async logout() {
    throw new Error('Not implemented yet');
  }
}
