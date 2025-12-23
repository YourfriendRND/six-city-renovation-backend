import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserInterface, CommonEntity, EconfirmationInterface } from '@libs/types';
import { User } from '../../users/entities/user.entity';

@Entity('email_confirmations')
export class Econfirmation extends CommonEntity implements EconfirmationInterface {
    @Column({
        type: 'varchar',
        length: 200,    
    })
    token: string;

    @Column({
        type: 'timestamp with time zone',
        name: 'expired_at'
    })
    expiredAt: Date;

    @Column({
        default: false,
        name: 'is_confirmed'
    })
    isConfirmed: boolean = false;

    @DeleteDateColumn({
        name: 'deleted_at',
        nullable: true,
        type: 'timestamp with time zone',
    })
    deletedAt?: Date | null;

    @ManyToOne(() => User, (user) => user.emailConfirmations)
    @JoinColumn({ name: 'user_id' })
    user: UserInterface;
}
