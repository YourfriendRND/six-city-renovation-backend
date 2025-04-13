import {
  Column,
  OneToMany,
  Entity,
} from 'typeorm';

import { CommonEntity } from '../../../shared/common';
import { UserInterface, CommentInterface } from 'src/shared/interfaces';
import { Roles } from '../../../shared/constants';
import { Place } from '../../../modules/places/entities/place.entity';
import { Comment } from '../../../modules/comments/entities/comment.entity';

@Entity('users')
export class User extends CommonEntity implements UserInterface {
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

  @OneToMany(() => Place, (place) => place)
  places: Place[];

  @OneToMany(() => Comment, (comment) => comment)
  comments: CommentInterface[];
}
