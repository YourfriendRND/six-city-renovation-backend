import {
  Inject,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import { UserService } from '../users/user.service';
import { CreateUserDTO, LoginDTO } from './dto';
import { SessionService } from '../sessions/session.service';
import { SessionInterface, UserInterface } from 'src/shared/interfaces';
import { TokenPayload, UserLogin } from 'src/shared/types';
import jwtConfig from 'src/shared/config/jwt/jwt.config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtParams: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  async register(dto: CreateUserDTO): Promise<UserInterface> {
    this.logger.log(`Register user: ${dto.email}`);
    const { email } = dto;

    const user = await this.userService.findUserByEmail(email);

    if (user) {
      throw new ConflictException(`User with email: ${email} already exists`);
    }

    return this.userService.createUser(dto);
  }

  async login(
    dto: LoginDTO,
    userSessionDto: Partial<SessionInterface>,
  ): Promise<UserLogin> {
    const { email } = dto;

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }

    const isPasswordValid = this.userService.comparePassword(
      dto.password,
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
      userSessionDto,
    );

    if (!createdSession) {
      throw new Error('Failed to create session');
    }

    const accessToken = this.createAccessToken(createdSession);
    const refreshToken = this.createRefreshToken(createdSession);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(user: UserInterface): Promise<string> {
    const { sessionId } = user;

    if (!sessionId) {
      throw new Error('Request does not have session id, please relogin');
    }

    await this.sessionService.deleteSession(sessionId);

    return 'Logout successfuly';
  }

  createAccessToken(session: SessionInterface): string {
    const tokenPayload: TokenPayload = { sub: session.id };

    return this.jwtService.sign(tokenPayload, {
      secret: this.jwtParams.secret,
      expiresIn: this.jwtParams.expiresIn,
    });
  }

  createRefreshToken(session: SessionInterface): string {
    const tokenPayload: TokenPayload = { sub: session.id };

    return this.jwtService.sign(tokenPayload, {
      secret: this.jwtParams.refreshSecret,
      expiresIn: this.jwtParams.refreshExpiresIn,
    });
  }

  async refreshToken(user: UserInterface, { ipAddress, userAgent }: Partial<SessionInterface>): Promise<UserLogin> {
    const { sessionId: currentUserSessionId } = user;

    console.log(user.sessionId)
    console.log(currentUserSessionId);

    await this.sessionService.deleteSession(currentUserSessionId);

    const userWithLoginDate = await this.userService.updateUserLastLogin(
      user.id,
    );

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

    return {
      accessToken,
      refreshToken,
    };

  }

}
