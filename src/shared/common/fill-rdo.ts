import { ClassConstructor, plainToInstance } from 'class-transformer';

export function fillResponseDto<T, D>(dto: ClassConstructor<T>, data: D): T {
  return plainToInstance<T, D>(dto, data, {
    excludeExtraneousValues: true,
  });
}
