import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import { emailConfig } from '../../config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailerService.name);

  constructor(
    @Inject(emailConfig.KEY)
    private readonly config: ConfigType<typeof emailConfig>,
    private readonly mailService: MailerService,
  ) {}

  async sendEmail(to: string, subject: string, template: string, context?: Record<string, string>): Promise<void> {
    this.logger.log(`Start to send ${template} email to ${to}`);
    try {
      await this.mailService.sendMail({
        from: this.config.user,
        to,
        subject,
        template,
        context,
      }).then(() => {
        this.logger.log(`Email to ${to} successfully sent`);
      })
    } catch (err) {
      this.logger.error(`Error while send email by template ${template} to ${to}`);
      this.logger.error(err);
    }
  }
}
