import {
  Entity,
  Column,
  Check,
  ManyToOne,
  JoinTable,
} from 'typeorm';

import { CommonEntity } from '../../../shared/common';
import {
  CommentInterface,
  PlaceInterface,
  UserInterface,
} from 'src/shared/interfaces';
import { Place } from '../../../modules/places/entities/place.entity';
import { User } from '../../../modules/users/entities/user.entity';

@Entity('comments')
export class Comment extends CommonEntity implements CommentInterface {
  @Column({ type: 'varchar', length: 1000 })
  text: string;

  @Column({ type: 'int' })
  @Check('rating > 0 AND rating <= 5')
  rating: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinTable({
    name: 'user_id',
  })
  user: UserInterface;

  @ManyToOne(() => Place, (place) => place.id)
  @JoinTable({
    name: 'place_id',
  })
  place: PlaceInterface;
}
