import { Column, OneToMany, Entity, OneToOne, JoinColumn } from 'typeorm';

import { CommonEntity } from '../../../shared/common';
import {
  UserInterface,
  CommentInterface,
  FileInterface,
  SessionInterface,
} from '../../../shared/interfaces';
import { Roles } from '../../../shared/constants';
import { Place } from '../../../modules/places/entities/place.entity';
import { Comment } from '../../../modules/comments/entities/comment.entity';
import { File } from '../../../modules/files/entities/file.entity';
import { Session } from '../../../modules/sessions/entities/session.entity';

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
