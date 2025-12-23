import { Controller } from '@nestjs/common';
import { CustomRabbitSubscribe, WrapRpcResponse } from '@libs/modules';
import { EmailConfirmationPayload, EmailConfirmationRequestPayload, UserInterface } from '@libs/types';
import { EmailConfirmationService } from './email-confirmation.service';

@Controller()
export class EmailConfirmationController {
    constructor(private readonly emailConfirmService: EmailConfirmationService) {}

    @CustomRabbitSubscribe({
        exchange: 'main_exchange',
        queue: 'email_confirmation_create',
        routingKey: 'email_confirmation/create',
        createQueueIfNotExist: true,
    })
    @WrapRpcResponse()
    async createRequest(
        payload: EmailConfirmationRequestPayload,
    ) {
        console.log(payload)
        return this.emailConfirmService.createRequest(payload)
    }

    @CustomRabbitSubscribe({
        exchange: 'main_exchange',
        queue: 'email_confirmation_confirm',
        routingKey: 'email_confirmation/confirm',
        createQueueIfNotExist: true,
    })
    @WrapRpcResponse()  
    async confirmRequest(
        payload: EmailConfirmationPayload
    ) {
        return this.emailConfirmService.confirmRequest(payload)
    }

}