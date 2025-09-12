import * as dayjs from 'dayjs';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';

import { Session } from './entities/session.entity';
import { SessionInterface, UserInterface } from 'src/shared/interfaces';
import { CacheService } from 'src/core/cache/cache.service';
import jwtConfig from 'src/shared/config/jwt/jwt.config';
import { parseTimeToSeconds } from 'src/shared/common';
import applicationConfig from 'src/shared/config/application/application.config';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @Inject(jwtConfig.KEY)
    private readonly jwtParams: ConfigType<typeof jwtConfig>,
    private readonly cacheService: CacheService,
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {
    this.logger.log(`${SessionService.name} has been initialized`);
  }

  private createSessionCacheKey(sessionId: string): string {
    return `${this.appConfig.applicationGlobalPrefix}:session:${sessionId}`;
  }

  async createSession(
    user: UserInterface,
    { ipAddress, userAgent }: Partial<SessionInterface>,
  ): Promise<SessionInterface> {
    await this.dropUserExpiredSessions(user.id);

    const expiresTime = parseTimeToSeconds(this.jwtParams.refreshExpiresIn);
    const expiresAt = dayjs().add(expiresTime, 'second').toDate();

    const session = this.sessionRepository.create({
      userAgent,
      ipAddress,
      expiresAt,
      user,
    });

    const createdSession = await this.sessionRepository.save(session);

    const sessionCacheKey = this.createSessionCacheKey(session.id);

    const userSessionData: UserInterface = {
      ...user,
    };

    delete userSessionData.password;

    await this.cacheService.insertRecord<UserInterface>(
      sessionCacheKey,
      userSessionData,
      expiresTime,
    );

    this.logger.log(
      `Session ${createdSession.id} for user: ${user.email} has been created`,
    );

    return createdSession;
  }

  async deleteSession(sessionId: string): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: {
        id: sessionId,
      },
      relations: {
        user: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.sessionRepository.remove(session);

    const sessionKey = this.createSessionCacheKey(sessionId);

    await this.cacheService.deleteRecord(sessionKey);

    this.logger.warn(
      `Session with id: ${sessionId} for user with id: ${session?.user?.id} has been deleted`,
    );
  }

  async dropUserExpiredSessions(userId: string): Promise<void> {
    const sessions = await this.sessionRepository.find({
      where: {
        user: {
          id: userId,
        },
        expiresAt: LessThanOrEqual(new Date()),
      },
    });

    if (!sessions.length) {
      return;
    }

    const sessionsIds = await Promise.all(
      sessions.map(async (session) => {
        const sessionId = session.id;
        await this.deleteSession(sessionId);

        return sessionId;
      }),
    );

    this.logger.warn(
      `Sessions ${sessionsIds.join(', ')} for user: ${userId} have been expired and successfully deleted`,
    );
  }

  async dropAllUserSessions(userId: string): Promise<void> {
    const sessions = await this.sessionRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!sessions.length) {
      return;
    }

    await Promise.all(
      sessions.map(async (session) => {
        const sessionId = session.id;
        await this.deleteSession(sessionId);

        return sessionId;
      }),
    );

    await this.sessionRepository.remove(sessions);

    this.logger.warn(
      `All sessions for user: ${userId} have been successfully deleted`,
    );
  }

  async findActiveUserSessionById(id: string): Promise<UserInterface> {
    const sessionKey = this.createSessionCacheKey(id);

    const userFromCache =
      await this.cacheService.findRecord<UserInterface>(sessionKey);

    if (!userFromCache) {
      const session = await this.sessionRepository.findOne({
        where: {
          id,
          expiresAt: MoreThan(new Date()),
        },
        relations: {
          user: true,
        },
      });

      if (!session) {
        throw new NotFoundException(`Session with id: ${id} not found`);
      }

      const ttl = dayjs().diff(session.expiresAt) / 1000;

      const user = { ...session.user };
      delete user.password;

      await this.cacheService.insertRecord<UserInterface>(
        sessionKey,
        user,
        ttl,
      );

      return user;
    }

    return userFromCache;
  }
}
