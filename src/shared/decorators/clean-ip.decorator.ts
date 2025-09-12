import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CleanIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const fullIp: string = request.ip || request.connection.remoteAddress || '';

    if (fullIp && fullIp.startsWith('::ffff:')) {
      return fullIp.substring(7);
    }

    return fullIp;
  },
);
