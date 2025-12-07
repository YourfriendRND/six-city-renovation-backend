import { SetMetadata } from '@nestjs/common';
import { RabbitMQSubscribeOptionsInterface } from '../types';

export const RABBIT_SUBSCRIBE_METADATA = 'RABBIT_SUBSCRIBE_METADATA';

export function CustomRabbitSubscribe(
  options: RabbitMQSubscribeOptionsInterface,
): MethodDecorator {
  return function (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    return SetMetadata(RABBIT_SUBSCRIBE_METADATA, {
      ...options,
      methodName: propertyKey,
      className: target.constructor.name,
    })(target, propertyKey, descriptor);
  };
}
