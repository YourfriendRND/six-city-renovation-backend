import {
  Injectable,
  Inject,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';

import { JwtStrategies, JwtTokens } from '@libs/constants';
import {
  extractJwtFromCookie,
  jwtConfig,
  createSessionCacheKey,
} from '@libs/config';
import { CacheService } from '@libs/modules';
import { TokenPayload, UserInterface } from '@libs/types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JwtStrategies.JwtRefresh,
) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwt: ConfigType<typeof jwtConfig>,
    private readonly cacheService: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractJwtFromCookie(`${JwtTokens.RefreshToken}_${jwt.cookiePrefix}`),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwt.refreshSecret,
    });
  }

  async validate(payload: TokenPayload): Promise<Partial<UserInterface>> {
    try {
      if (!payload?.sub) {
        throw new UnauthorizedException(
          'Unauthorized: Token does not have payload',
        );
      }

      const cacheSessionKey = createSessionCacheKey(
        this.jwt.cookiePrefix,
        payload.sub,
      );

      const user =
        await this.cacheService.findRecord<Omit<UserInterface, 'password'>>(
          cacheSessionKey,
        );

      if (!user) {
        throw new NotFoundException('Unauthorized');
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
