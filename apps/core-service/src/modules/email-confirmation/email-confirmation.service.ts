import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'; 
import { EconfirmationInterface, EmailConfirmationPayload, EmailConfirmationRequestPayload, UserInterface } from '@libs/types';
import { Econfirmation } from './entities/email-confirmation.entity';
import { ConfigType } from '@nestjs/config';
import confirmationConfig from '../../config/confirmation.config';
import * as dayjs from 'dayjs';
import { parseTimeToMilliseconds, TooManyRequestsException, generateOneTimeToken } from '@libs/config';
import { UserService } from '../users/user.service';

@Injectable()
export class EmailConfirmationService {
    constructor(
        @Inject(confirmationConfig.KEY)
        private readonly config: ConfigType<typeof confirmationConfig>,
        @InjectRepository(Econfirmation)
        private readonly econfirmRepository: Repository<Econfirmation>,
        private readonly userService: UserService,
    ) {}

    private async assertRequestsByLimits(user: UserInterface): Promise<void> {
        const currentHour = dayjs().add(-1, 'hours').toDate();

        const retriesByCurrentHour = await this.econfirmRepository.count({
            where: {
                createdAt: MoreThanOrEqual(currentHour),
                user: {
                    id: user.id,
                }
            },
            withDeleted: true,
        });

        if (retriesByCurrentHour >= this.config.emailConfirmationRetryByHour) {
           const nextHour = dayjs().subtract(1, 'hours').toDate();

           throw new TooManyRequestsException(nextHour);
        }
    }

    private async assertAlreadyConfirmedUserEmail(user: UserInterface): Promise<void> {
        const confirmedRequest = await this.econfirmRepository.findOne({
            where: {
                isConfirmed: true,
                user: {
                    id: user.id
                }
            }
        });

        if (confirmedRequest) {
            throw new ConflictException('User email already confirmed');
        }
    }

    private async findRequest(token: string): Promise<EconfirmationInterface> {
        return this.econfirmRepository.findOne({
            where: {
                isConfirmed: false,
                token,
                expiredAt: MoreThanOrEqual(new Date())
            }
        })
    }

    async createRequest(payload: EmailConfirmationRequestPayload): Promise<EconfirmationInterface> {
        try {
        const user = await this.userService.findUserByEmail(payload.email);

        if (!user) {
            throw new NotFoundException(`User with email: ${payload.email} not found`);
        }

        await Promise.all([
            this.assertRequestsByLimits(user),
            this.assertAlreadyConfirmedUserEmail(user)
        ]);
        const token = generateOneTimeToken(20, 150);
        console.log(token)
        return this.econfirmRepository.save({
            token,
            expiredAt: dayjs().add(parseTimeToMilliseconds(this.config.emailConfirmationExpiresIn), 'milliseconds').toDate(), 
            user,
        });

        } catch (err) {
            console.error(err)
        }

    }

    async confirmRequest(payload: EmailConfirmationPayload): Promise<EconfirmationInterface> {
        const request = await this.findRequest(payload.token);

        if (!request) {
            throw new NotFoundException('Impossible confirm email. Request for confirmation not found');
        }

        request.isConfirmed = true;
        
        return this.econfirmRepository.save(request);
    }

}
