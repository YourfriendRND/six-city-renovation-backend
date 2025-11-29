import { HttpException } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RpcErrorResponse, RpcSuccessResponse } from '@libs/types';

export abstract class BaseRpcController {
  constructor(protected readonly amqpConnection: AmqpConnection) {}

  protected async makeRpcCall<T, D = object>(
    routingKey: string,
    payload?: D,
    exchange = 'main_exchange',
    timeout = 5000,
  ): Promise<T> {
    const response = await this.amqpConnection.request<
      RpcSuccessResponse<T> | RpcErrorResponse
    >({
      exchange,
      routingKey,
      timeout,
      payload,
    });

    if (response.success === false) {
      this.throwRpcError(response);
    }

    return response.data;
  }

  private throwRpcError(response: RpcErrorResponse): never {
    const error = response.exception;
    throw new HttpException(
      {
        message: error.message,
        code: error.statusCode,
        error: error.error,
      },
      error.statusCode,
    );
  }
}
