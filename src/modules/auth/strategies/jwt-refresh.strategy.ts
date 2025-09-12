import { Injectable, Inject, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';

import jwtConfig from 'src/shared/config/jwt/jwt.config';
import applicationConfig from 'src/shared/config/application/application.config';
import { SessionService } from 'src/modules/sessions/session.service';
import { JwtTokens, JwtStrategies } from 'src/shared/constants';
import { TokenPayload } from 'src/shared/types';
import { UserInterface } from 'src/shared/interfaces';
import { extractJwtFromCookie } from 'src/shared/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JwtStrategies.JwtRefresh,
) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractJwtFromCookie(
          `${JwtTokens.RefreshToken}_${appConfig.applicationGlobalPrefix}`,
        ),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.refreshSecret,
    });
  }

  async validate(payload: TokenPayload): Promise<UserInterface> {
    try {
      const user = await this.sessionService.findActiveUserSessionById(
        payload.sub,
      );

      if (!user) {
        throw new UnauthorizedException('Unauthorized');
      }

      return {
        ...user,
        sessionId: payload.sub,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Unauthorized');
      }

      throw error;
    }
  }
}
