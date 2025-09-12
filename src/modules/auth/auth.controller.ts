import * as dayjs from 'dayjs';
import {
  Body,
  Controller,
  Post,
  Headers,
  Res,
  Inject,
  HttpStatus,
  Get,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CookieOptions, Response } from 'express';
import { ConfigType } from '@nestjs/config';

import { AuthService } from './auth.service';
import { CreateUserDTO, LoginDTO } from './dto';
import {
  fillResponseDto,
  parseTimeToSeconds,
  CommonRdo,
} from 'src/shared/common';
import { SimplifiedUserRdo } from '../users/rdo';
import { ConflictExceptionRdo } from 'src/shared/exceptions';
import jwtConfig from 'src/shared/config/jwt/jwt.config';
import applicationConfig from 'src/shared/config/application/application.config';
import { JwtTokens, JwtStrategies } from 'src/shared/constants';
import { UserRequest, CleanIp, JWTGuard } from 'src/shared/decorators';
import { UserInterface } from 'src/shared/interfaces';
@ApiTags('Регистрация/авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
    @Inject(jwtConfig.KEY)
    private readonly jwtParams: ConfigType<typeof jwtConfig>,
    private readonly authService: AuthService,
  ) {}

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

  @ApiOperation({ summary: 'Авторизация пользователя на площадке' })
  @ApiBody({
    type: LoginDTO,
    description: 'Данные для входа в систему',
  })
  @ApiOkResponse({
    description: 'Пользователь успешно авторизован',
    type: CommonRdo,
  })
  @ApiUnauthorizedResponse({
    description: 'Некорректные данные пользователя для входа',
    example: 'Invalid password or email'
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Headers('user-agent') userAgent: string = '',
    @CleanIp() ipAddress: string,
    @Body() dto: LoginDTO,
    @Res() res: Response,
  ): Promise<Response<CommonRdo>> {
    const response = await this.authService.login(dto, {
      userAgent,
      ipAddress,
    });

    const accessCookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: dayjs()
        .add(parseTimeToSeconds(this.jwtParams.expiresIn) * 1.5, 'second')
        .toDate(),
    };

    const refreshTokenCookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: dayjs()
        .add(
          parseTimeToSeconds(this.jwtParams.refreshExpiresIn) * 1.5,
          'second',
        )
        .toDate(),
    };

    const accessCookieName = `${JwtTokens.AccessToken}_${this.appConfig.applicationGlobalPrefix}`;
    const refreshTokenCookieName = `${JwtTokens.RefreshToken}_${this.appConfig.applicationGlobalPrefix}`;

    return res
      .cookie(accessCookieName, response.accessToken, accessCookieOptions)
      .cookie(
        refreshTokenCookieName,
        response.refreshToken,
        refreshTokenCookieOptions,
      )
      .status(HttpStatus.OK)
      .send({ message: 'Login successful' });
  }

  @ApiOperation({ summary: 'Выход из системы' })
  @ApiOkResponse({
    type: CommonRdo,
    description: 'Выход выполнен успешно',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь неавторизован',
    example: 'Unauthorized'
  })
  @JWTGuard(JwtStrategies.JwtAccess)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @UserRequest() user: UserInterface,
    @Res() res: Response,
  ): Promise<Response<CommonRdo>> {
    const responseMessage = await this.authService.logout(user);

    const accessCookieName = `${JwtTokens.AccessToken}_${this.appConfig.applicationGlobalPrefix}`;
    const refreshTokenCookieName = `${JwtTokens.RefreshToken}_${this.appConfig.applicationGlobalPrefix}`;

    return res
      .clearCookie(accessCookieName, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .clearCookie(refreshTokenCookieName, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
      })
      .status(HttpStatus.OK)
      .send({ message: responseMessage });
  }

  @ApiOperation({ summary: 'Данные авторизованного пользователя' })
  @JWTGuard(JwtStrategies.JwtAccess)
  @ApiOkResponse({
    description: 'Данные авторизованного пользователя',
    type: SimplifiedUserRdo,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь неавторизован',
    example: 'Unauthorized'
  })
  @Get('me')
  getUserAuth(@UserRequest() user: UserInterface): SimplifiedUserRdo {
    return fillResponseDto(SimplifiedUserRdo, user);
  }

  @ApiOperation({
    summary: 'Обновление токена доступа',
  })
  @ApiOkResponse({
    description: 'Пара токенов успешно обновлнеа',
    type: CommonRdo,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь неавторизован',
    example: 'Unauthorized'
  })
  @JWTGuard(JwtStrategies.JwtRefresh)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(
    @Headers('user-agent') userAgent: string = '',
    @CleanIp() ipAddress: string,
    @UserRequest() user: UserInterface,
    @Res() res: Response,
  ): Promise<Response<CommonRdo>> {
    const { accessToken, refreshToken } = await this.authService.refreshToken(user, { userAgent, ipAddress });

    const accessCookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: dayjs()
        .add(parseTimeToSeconds(this.jwtParams.expiresIn) * 1.5, 'second')
        .toDate(),
    };

    const refreshTokenCookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: dayjs()
        .add(
          parseTimeToSeconds(this.jwtParams.refreshExpiresIn) * 1.5,
          'second',
        )
        .toDate(),
    };

    const accessCookieName = `${JwtTokens.AccessToken}_${this.appConfig.applicationGlobalPrefix}`;
    const refreshTokenCookieName = `${JwtTokens.RefreshToken}_${this.appConfig.applicationGlobalPrefix}`;
    
    return res
      .cookie(accessCookieName, accessToken, accessCookieOptions)
      .cookie(
        refreshTokenCookieName,
        refreshToken,
        refreshTokenCookieOptions,
      )
      .status(HttpStatus.OK)
      .send({ message: 'Token pair refresh successfully' });    
  }
}
