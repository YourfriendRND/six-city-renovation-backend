import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
  Inject,
  Res,
  Get,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigType } from '@nestjs/config';

import {
  fillResponseDto,
  CleanIp,
  parseTimeToMilliseconds,
  jwtConfig,
  buildCookie,
} from '@libs/config';
import {
  CreateUserDTO,
  SimplifiedUserRdo,
  UserInterface,
  LoginDTO,
  CommonRdo,
  CookieOptions,
  AuthLoginPayload,
  UserLogin,
  AuthLogoutPayload,
  AuthRefreshPayload,
  EconfirmationInterface,
} from '@libs/types';
import { JwtStrategies, JwtTokens } from '@libs/constants';
import { BaseRpcController } from '../../types';
import { JWTGuard, UserRequest } from '../../decorators';

@ApiTags('Регистрация/авторизация')
@Controller('auth')
export class AuthController extends BaseRpcController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    protected readonly amqpConnection: AmqpConnection,
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(jwtConfig.KEY)
    private readonly jwtParams: ConfigType<typeof jwtConfig>,
  ) {
    super(amqpConnection);
  }

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
    //TODO: type: ConflictExceptionRdo,
    description: 'Пользователь с таким email уже существует',
  })
  @Post('register')
  async register(@Body() dto: CreateUserDTO): Promise<SimplifiedUserRdo> {
    const createdUser = await this.makeRpcCall<UserInterface>(
      'auth/register',
      dto,
    );

    try {
      const confirmationRequest = await this.makeRpcCall<EconfirmationInterface>(
        'email_confirmation/create',
        {
          email: createdUser.email
        }
      );
  
      await this.makeRpcCall(
        'mail/welcome',
        {
          email: createdUser.email,
          name: createdUser.name,
          token: confirmationRequest.token,
        }
      );
    } catch (err) {
      this.logger.error(`Error while create and send confirmation email to user: ${createdUser.email}`, err)
    }
    
    return fillResponseDto(SimplifiedUserRdo, createdUser);
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
    example: 'Invalid password or email',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Headers('user-agent') userAgent: string = '',
    @CleanIp() ipAddress: string,
    @Body() dto: LoginDTO,
    @Res({ passthrough: true }) res: unknown,
  ): Promise<CommonRdo> {
    const response = await this.makeRpcCall<UserLogin, AuthLoginPayload>(
      'auth/login',
      {
        ...dto,
        userAgent,
        ipAddress,
      },
    );

    const accessCookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: dayjs()
        .add(
          parseTimeToMilliseconds(this.jwtParams.expiresIn) * 1.5,
          'milliseconds',
        )
        .toDate(),
    };

    const refreshTokenCookieOptions: CookieOptions = {
      ...accessCookieOptions,
      expires: dayjs()
        .add(
          parseTimeToMilliseconds(this.jwtParams.refreshExpiresIn) * 1.5,
          'milliseconds',
        )
        .toDate(),
    };

    const accessCookieName = `${JwtTokens.AccessToken}_${this.jwtParams.cookiePrefix}`;
    const refreshTokenCookieName = `${JwtTokens.RefreshToken}_${this.jwtParams.cookiePrefix}`;

    const httpAdapter = this.httpAdapterHost.httpAdapter;

    httpAdapter
      .setHeader(
        res,
        'Set-Cookie',
        [
          buildCookie(
            accessCookieName,
            response.accessToken,
            accessCookieOptions,
          ),
          buildCookie(
            refreshTokenCookieName,
            response.refreshToken,
            refreshTokenCookieOptions,
          ),
        ].join('; '),
      )
      .status(HttpStatus.OK);

    return { message: 'Login successful' };
  }

  @ApiOperation({ summary: 'Выход из системы' })
  @ApiOkResponse({
    type: CommonRdo,
    description: 'Выход выполнен успешно',
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь неавторизован',
    example: 'Unauthorized',
  })
  @JWTGuard()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @UserRequest() user: UserInterface,
    @Res({ passthrough: true }) res: unknown,
  ): Promise<CommonRdo> {
    await this.makeRpcCall<CommonRdo, AuthLogoutPayload>('auth/logout', {
      userId: user.id,
      sessionId: user.sessionId,
    });

    const accessCookieName = `${JwtTokens.AccessToken}_${this.jwtParams.cookiePrefix}`;
    const refreshTokenCookieName = `${JwtTokens.RefreshToken}_${this.jwtParams.cookiePrefix}`;

    const cleanCookie: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(0),
    };

    const httpAdapter = this.httpAdapterHost.httpAdapter;

    httpAdapter
      .setHeader(
        res,
        'Set-Cookie',
        [
          buildCookie(accessCookieName, '', cleanCookie),
          buildCookie(refreshTokenCookieName, '', cleanCookie),
        ].join('; '),
      )
      .status(HttpStatus.OK);

    return { message: 'Logout successful' };
  }

  @ApiOperation({ summary: 'Данные авторизованного пользователя' })
  @JWTGuard()
  @ApiOkResponse({
    description: 'Данные авторизованного пользователя',
    type: SimplifiedUserRdo,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь неавторизован',
    example: 'Unauthorized',
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
    example: 'Unauthorized',
  })
  @JWTGuard(JwtStrategies.JwtRefresh)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshTokenPair(
    @Headers('user-agent') userAgent: string = '',
    @CleanIp() ipAddress: string,
    @UserRequest() user: UserInterface,
    @Res({ passthrough: true }) res: unknown,
  ): Promise<CommonRdo> {
    const { accessToken, refreshToken } = await this.makeRpcCall<
      UserLogin,
      AuthRefreshPayload
    >('auth/refresh', {
      userAgent,
      ipAddress,
      ...user,
    });

    const accessCookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: dayjs()
        .add(
          parseTimeToMilliseconds(this.jwtParams.expiresIn) * 1.5,
          'milliseconds',
        )
        .toDate(),
    };

    const refreshTokenCookieOptions: CookieOptions = {
      ...accessCookieOptions,
      expires: dayjs()
        .add(
          parseTimeToMilliseconds(this.jwtParams.refreshExpiresIn) * 1.5,
          'milliseconds',
        )
        .toDate(),
    };

    const accessCookieName = `${JwtTokens.AccessToken}_${this.jwtParams.cookiePrefix}`;
    const refreshTokenCookieName = `${JwtTokens.RefreshToken}_${this.jwtParams.cookiePrefix}`;

    const httpAdapter = this.httpAdapterHost.httpAdapter;

    httpAdapter
      .setHeader(
        res,
        'Set-Cookie',
        [
          buildCookie(accessCookieName, accessToken, accessCookieOptions),
          buildCookie(
            refreshTokenCookieName,
            refreshToken,
            refreshTokenCookieOptions,
          ),
        ].join('; '),
      )
      .status(HttpStatus.OK);

    return { message: 'Token pair refresh successfully' };
  }
}
