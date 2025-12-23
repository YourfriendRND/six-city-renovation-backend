import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { emailConfig } from '../../config';
import { RabbitMQModule } from '@libs/modules';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'main_exchange',
          type: 'direct',
        },
      ],
    }),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigType<typeof emailConfig>) => ({
          transport: {
            host: config.host,
            port: config.port,
            secure: true,
            auth: {
              user: config.user,
              pass: config.password,
            }
          },
          template: {
            dir: join(__dirname, '../../../../../templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          }
      }),
      inject: [emailConfig.KEY],
    })
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [],
})
export class MailModule {}
