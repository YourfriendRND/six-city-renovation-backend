import { Column, OneToMany, Entity, OneToOne, JoinColumn } from 'typeorm';

import {
  CommonEntity,
  UserInterface,
  CommentInterface,
  FileInterface,
  SessionInterface,
} from '@libs/types';
import { Roles } from '@libs/constants';
import { Place } from '../../../modules/places/entities/place.entity';
import { File } from '../../../modules/files/entities/file.entity';
import { Session } from '../../sessions/entities/session.entity';
import { Comment } from '../../comments/entities/comment.entity';

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

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string; // TODO: Удалить

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

  @OneToOne(() => File, (file) => file.id, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'avatar_id' })
  avatar?: FileInterface;

  @OneToMany(() => Session, (session) => session.user)
  sessions: SessionInterface[];
}
