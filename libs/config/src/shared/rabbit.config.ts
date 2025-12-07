import { registerAs } from '@nestjs/config';

import { NameSpaces } from '@libs/config';
import { validateConfig } from '@libs/config/common';
import { RabbitConfigSchema } from '@libs/config/schemas';

export default registerAs(NameSpaces.RabbitMQ, () => {
  return validateConfig(RabbitConfigSchema, {
    host: process.env.RABBITMQ_HOST,
    port: process.env.RABBITMQ_PORT,
    user: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASSWORD,
    vhost: process.env.RABBITMQ_VHOST || '',
    url: `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
  });
});
