import { ConflictException, Injectable, Logger } from '@nestjs/common';

import { UserService } from '../users/user.service';
import { CreateUserDTO } from './dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly userService: UserService) {}

  async register(dto: CreateUserDTO): Promise<User> {
    this.logger.log(`Register user: ${dto.email}`);
    const { email } = dto;

    const user = await this.userService.findUserByEmail(email);

    if (user) {
      throw new ConflictException(`User with email: ${email} already exists`);
    }

    return this.userService.createUser(dto);
  }

  async login() {}
}
