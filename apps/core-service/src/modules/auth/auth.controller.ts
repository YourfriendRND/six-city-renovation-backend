import { Controller } from '@nestjs/common';
import { CustomRabbitSubscribe, WrapRpcResponse } from '@libs/modules';
import {
  AuthLoginPayload,
  AuthLogoutPayload,
  AuthRefreshPayload,
  CommonRdo,
  CreateUserDTO,
  UserInterface,
  UserLogin,
} from '@libs/types';
import { AuthService } from './auth.service';

@Controller()
export class CoreAuthController {
  constructor(private readonly authService: AuthService) {}

  @CustomRabbitSubscribe({
    exchange: 'main_exchange',
    routingKey: 'auth/register',
    queue: 'auth_register',
    createQueueIfNotExist: true,
  })
  @WrapRpcResponse()
  async registerUser(payload: CreateUserDTO): Promise<UserInterface> {
    return this.authService.registerUser(payload);
  }

  @CustomRabbitSubscribe({
    exchange: 'main_exchange',
    routingKey: 'auth/login',
    queue: 'auth_login',
    createQueueIfNotExist: true,
  })
  @WrapRpcResponse()
  async loginUser(payload: AuthLoginPayload): Promise<UserLogin> {
    return this.authService.login(payload);
  }

  @CustomRabbitSubscribe({
    exchange: 'main_exchange',
    routingKey: 'auth/logout',
    queue: 'auth_logout',
    createQueueIfNotExist: true,
  })
  @WrapRpcResponse()
  async logoutUser(payload: AuthLogoutPayload): Promise<CommonRdo> {
    return this.authService.logout(payload);
  }

  @CustomRabbitSubscribe({
    exchange: 'main_exchange',
    routingKey: 'auth/refresh',
    queue: 'auth_refresh',
    createQueueIfNotExist: true,
  })
  @WrapRpcResponse()
  async refreshTokens(payload: AuthRefreshPayload): Promise<UserLogin> {
    return this.authService.refresh(payload);
  }
}
