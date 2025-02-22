import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Entity,
} from 'typeorm';

import { Roles } from '../../../shared/constants';
import { Place } from '../../../modules/places/entities/place.entity';
import { Comment } from '../../../modules/comments/entities/comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ default: false, name: 'is_pro' })
  isPro: boolean;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'avatar_url' })
  avatarUrl: string;

  @Column({ enum: Roles, default: Roles.User })
  role: Roles;

  @Column({
    name: 'last_login_at',
    type: 'timestamp',
    nullable: true,
  })
  lastLoginAt: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Place, (place) => place)
  places: Place[];

  @OneToMany(() => Comment, (comment) => comment)
  comments: Comment[];
}
