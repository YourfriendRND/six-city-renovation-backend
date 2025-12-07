import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  CreateUserDTO,
  UserInterface,
  SessionInterface,
  UserLogin,
  TokenPayload,
  AuthLoginPayload,
  AuthLogoutPayload,
  CommonRdo,
  AuthRefreshPayload,
} from '@libs/types';
import { UserService } from '../users/user.service';
import { ConfigType } from '@nestjs/config';
import {
  jwtConfig,
  parseTimeToMilliseconds,
  createSessionCacheKey,
} from '@libs/config';
import { SessionService } from '../sessions/session.service';
import { CacheService } from '@libs/modules';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtParams: ConfigType<typeof jwtConfig>,
    private readonly sessionService: SessionService,
    private readonly cacheService: CacheService,
  ) {}

  private createAccessToken(session: SessionInterface): string {
    const tokenPayload: TokenPayload = { sub: session.id };

    return this.jwtService.sign<TokenPayload>(tokenPayload, {
      secret: this.jwtParams.secret,
      expiresIn: parseTimeToMilliseconds(this.jwtParams.expiresIn),
    });
  }

  private createRefreshToken(session: SessionInterface): string {
    const tokenPayload: TokenPayload = { sub: session.id };

    return this.jwtService.sign<TokenPayload>(tokenPayload, {
      secret: this.jwtParams.refreshSecret,
      expiresIn: parseTimeToMilliseconds(this.jwtParams.refreshExpiresIn),
    });
  }

  private createUserSessionPayload(
    user: UserInterface,
  ): Omit<UserInterface, 'password'> {
    const copyUser = structuredClone(user);
    delete copyUser.password;

    return copyUser;
  }

  async registerUser(dto: CreateUserDTO): Promise<UserInterface> {
    this.logger.log(`Register user: ${dto.email}`);
    const { email } = dto;

    const user = await this.userService.findUserByEmail(email);

    if (user) {
      throw new ConflictException(`User with email: ${email} already exists`);
    }

    return this.userService.createUser(dto);
  }

  async login(payload: AuthLoginPayload): Promise<UserLogin> {
    const { email } = payload;

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }

    const isPasswordValid = this.userService.comparePassword(
      payload.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const userWithLoginDate = await this.userService.updateUserLastLogin(
      user.id,
    );

    const createdSession = await this.sessionService.createSession(
      userWithLoginDate,
      {
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
      },
    );

    if (!createdSession) {
      throw new UnprocessableEntityException('Failed to create session');
    }

    const accessToken = this.createAccessToken(createdSession);
    const refreshToken = this.createRefreshToken(createdSession);

    const cacheSessionKey = createSessionCacheKey(
      this.jwtParams.cookiePrefix,
      createdSession.id,
    );
    const cacheSessionValue = this.createUserSessionPayload(user);
    await this.cacheService.insertRecord(
      cacheSessionKey,
      cacheSessionValue,
      parseTimeToMilliseconds(this.jwtParams.refreshExpiresIn),
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(payload: AuthLogoutPayload): Promise<CommonRdo> {
    const session = await this.sessionService.findActiveUserSessionById(
      payload.sessionId,
    );

    if (session.user.id !== payload.userId) {
      throw new ConflictException('Incorrect session');
    }

    const cacheSessionKey = createSessionCacheKey(
      this.jwtParams.cookiePrefix,
      session.id,
    );

    const cacheSession = await this.cacheService.findRecord(cacheSessionKey);

    if (cacheSession) {
      await this.cacheService.deleteRecord(cacheSessionKey);
    }

    await this.sessionService.deleteSession(session.id);

    return {
      message: 'success',
    };
  }

  async refresh(payload: AuthRefreshPayload): Promise<UserLogin> {
    const { sessionId, id: userId, ipAddress, userAgent } = payload;

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    await this.logout({ sessionId, userId });

    const userWithLoginDate =
      await this.userService.updateUserLastLogin(userId);

    const createdSession = await this.sessionService.createSession(
      userWithLoginDate,
      {
        ipAddress,
        userAgent,
      },
    );

    if (!createdSession) {
      throw new Error('Failed to create session');
    }

    const accessToken = this.createAccessToken(createdSession);
    const refreshToken = this.createRefreshToken(createdSession);

    const cacheSessionKey = createSessionCacheKey(
      this.jwtParams.cookiePrefix,
      createdSession.id,
    );

    const cacheSessionValue = this.createUserSessionPayload(user);
    await this.cacheService.insertRecord(
      cacheSessionKey,
      cacheSessionValue,
      parseTimeToMilliseconds(this.jwtParams.refreshExpiresIn),
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
