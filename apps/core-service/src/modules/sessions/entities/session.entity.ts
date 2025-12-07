import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntity, SessionInterface, UserInterface } from '@libs/types';
import { User } from '../../users/entities/user.entity';

@Entity('sessions')
export class Session extends CommonEntity implements SessionInterface {
  @Column({ type: 'varchar', length: 255, name: 'ip_address', nullable: true })
  ipAddress?: string;

  @Column({ type: 'varchar', length: 1000, name: 'user_agent', nullable: true })
  userAgent?: string;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: UserInterface;
}
