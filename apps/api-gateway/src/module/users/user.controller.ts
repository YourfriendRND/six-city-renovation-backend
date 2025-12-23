import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

import { BaseRpcController } from '../../types';
import { CommonRdo, ConfirmEmailDTO, EconfirmationInterface, EmailConfirmationPayload } from '@libs/types';
import { fillResponseDto } from '@libs/config';


@ApiTags('Пользователи')
@Controller('users')
export class UserController extends BaseRpcController {

  constructor(
    protected readonly amqpConnection: AmqpConnection,
  ) {
     super(amqpConnection);
  }

  @ApiOperation({
    summary: 'Confirmation user email by token'
  })
  @ApiOkResponse({
    type: CommonRdo,
    description: 'Email confirmed',
  })
  @ApiNotFoundResponse({
    description: 'Request for confirmation not found',
    example: 'Impossible confirm email. Request for confirmation not found'
  })
  @Get('email-confirm/:token')
  async confirmUserEmail(
    @Param('token') token: string,
  ): Promise<CommonRdo> {
    await this.makeRpcCall<EconfirmationInterface, EmailConfirmationPayload>(
      'email_confirmation/confirm',
      {
        token,
      }
    );

    return fillResponseDto(CommonRdo, {
      message: 'Email successfully confirmed',
    })
  }

  @ApiOperation({
    summary: 'Repeate email and confirmation request'
  })
  @ApiOkResponse({
    description: 'Email has been sent',
    type: CommonRdo,
  })
  @ApiNotFoundResponse({
    description: 'User by email not found',
    example: 'User with email: example@mail.ru not found'
  })
  @Post('email-confirm/request')
  async repeateRequest(
    @Body() dto: ConfirmEmailDTO,
  ) {
    console.log(dto)
    const confirmationRequest = await this.makeRpcCall<EconfirmationInterface>(
        'email_confirmation/create',
        dto
    );
  
    await this.makeRpcCall(
      'mail/welcome',
      {
        email: confirmationRequest.user.email,
        name: confirmationRequest.user.name,
        token: confirmationRequest.token,
      }
    );

    return fillResponseDto(CommonRdo, {
      message: `Email to ${dto.email} has been sent`
    })
  }
}
