import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtStrategies } from '@libs/constants';

export const JWTGuard = (guard: JwtStrategies = JwtStrategies.JwtAccess) =>
  applyDecorators(UseGuards(AuthGuard(guard)));
