import { Controller, Inject } from '@nestjs/common';
import { CustomRabbitSubscribe, WrapRpcResponse } from '@libs/modules';
import { MailService } from './mail.service';
import { MailUserPayload } from '@libs/types';
import { ConfigType } from '@nestjs/config';
import appConfig from '../../config/app.config';

@Controller()
export class MailController {
  constructor(
    private readonly mailerService: MailService,
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>
  ) {}

  @CustomRabbitSubscribe({
    exchange: 'main_exchange',
    routingKey: 'mail/welcome',
    queue: 'mail_welcome',
    createQueueIfNotExist: true,
    durable: true,
  })
  @WrapRpcResponse()
  async sendWelcomeMessage(payload: MailUserPayload): Promise<void> {
    this.mailerService.sendEmail(payload.email, 'Welcome to Six-City Platform', './welcome', {
      name: payload.name,
      currentYear: new Date().getFullYear().toString(),
      dashboardLink: this.config.homeUrl,
      verifyEmailLink: `${this.config.homeUrl}/email-confirm/${payload.token}`
    })
  }
}
