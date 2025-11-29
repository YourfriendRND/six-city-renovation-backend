import { RpcErrorResponse, RpcSuccessResponse } from '@libs/types';
import { HttpException, HttpStatus } from '@nestjs/common';

export function WrapRpcResponse() {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): void {
    const originalMethod = descriptor.value;
    descriptor.value = async function <T>(
      ...params: unknown[]
    ): Promise<RpcSuccessResponse<T> | RpcErrorResponse> {
      try {
        const result = await originalMethod.apply(this, params);

        return {
          success: true,
          data: result,
          timestamp: new Date(),
        };
      } catch (error) {
        let message = 'Internal server error';
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorMessage = 'Internal server error';

        if (error instanceof HttpException) {
          statusCode = error.getStatus();
          message = error.message;
          const response = error.getResponse();

          if (typeof response === 'string') {
            errorMessage = response;
          } else {
            const message = response['error'] ? response['error'] : '';
            errorMessage = message;
          }
        }

        return {
          success: false,
          timestamp: new Date(),
          exception: {
            error: errorMessage,
            message,
            statusCode,
          },
        };
      }
    };
  };
}
