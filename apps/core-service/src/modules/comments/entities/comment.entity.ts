import { Entity, Column, Check, ManyToOne, JoinColumn } from 'typeorm';

import {
  CommonEntity,
  CommentInterface,
  PlaceInterface,
  UserInterface,
} from '@libs/types';
import { Place } from '../../places/entities/place.entity';
import { User } from '../../users/entities/user.entity';

@Entity('comments')
export class Comment extends CommonEntity implements CommentInterface {
  @Column({ type: 'varchar', length: 1000 })
  text: string;

  @Column({ type: 'int' })
  @Check('rating > 0 AND rating <= 5')
  rating: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: UserInterface;

  @ManyToOne(() => Place, (place) => place.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'place_id',
  })
  place: PlaceInterface;
}
