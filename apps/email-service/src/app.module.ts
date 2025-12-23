import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { emailConfig, mailAppConfig } from './config';
import { MailModule } from './modules/mailer/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mailAppConfig, emailConfig],
      envFilePath: './.env',
      cache: true,
    }),
    MailModule,
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
