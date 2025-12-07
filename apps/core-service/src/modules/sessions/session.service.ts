import * as dayjs from 'dayjs';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';

import { Session } from './entities/session.entity';
import { SessionInterface, UserInterface } from '@libs/types';
import { parseTimeToMilliseconds, jwtConfig } from '@libs/config';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @Inject(jwtConfig.KEY)
    private readonly jwtParams: ConfigType<typeof jwtConfig>,
  ) {
    this.logger.log(`${SessionService.name} has been initialized`);
  }

  async createSession(
    user: UserInterface,
    { ipAddress, userAgent }: Partial<SessionInterface>,
  ): Promise<SessionInterface> {
    await this.dropUserExpiredSessions(user.id);

    const expiresTime = parseTimeToMilliseconds(
      this.jwtParams.refreshExpiresIn,
    );
    const expiresAt = dayjs().add(expiresTime, 'milliseconds').toDate();

    const session = this.sessionRepository.create({
      userAgent,
      ipAddress,
      expiresAt,
      user,
    });

    const createdSession = await this.sessionRepository.save(session);

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
    // TODO: Заменить на Remove
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

  async findActiveUserSessionById(id: string): Promise<SessionInterface> {
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

    return session;
  }
}
