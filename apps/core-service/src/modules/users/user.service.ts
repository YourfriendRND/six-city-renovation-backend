import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ConfigType } from '@nestjs/config';
import { UserInterface, CreateUserDTO } from '@libs/types';
import { Roles } from '@libs/constants';

import { User } from './entities/user.entity';
import jwtConfig from '../../../../../libs/config/src/shared/jwt.config';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
  ) {}

  private hashPassword(password: string): string {
    const saltToken = this.config.passwordSalt;

    const hmac = crypto.createHmac('sha256', saltToken);
    hmac.update(password); // Добавляем пароль в HMAC
    const pepperedPassword = hmac.digest('hex');

    const salt = bcrypt.genSaltSync(8);
    return bcrypt.hashSync(pepperedPassword, salt);
  }

  comparePassword(inputPassword: string, hashedPassword: string): boolean {
    const saltToken = this.config.passwordSalt;

    const hmac = crypto.createHmac('sha256', saltToken);
    hmac.update(inputPassword);
    const hashedInput = hmac.digest('hex');

    return bcrypt.compareSync(hashedInput, hashedPassword);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(dto: CreateUserDTO): Promise<User> {
    const { password } = dto;
    const user = this.userRepository.create({
      ...dto,
      password: this.hashPassword(password),
      role: Roles.User,
      isPro: false,
    });

    const createdUser = await this.userRepository.save(user);

    this.logger.log(`User created: ${createdUser.email}`);

    return createdUser;
  }

  async updateUserLastLogin(id: string): Promise<UserInterface> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `User with id: ${id} not found, impossible to update login date`,
      );
    }

    user.lastLoginAt = new Date();

    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<UserInterface> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }
}
