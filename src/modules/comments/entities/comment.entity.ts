import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Check,
  ManyToOne,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Place } from '../../../modules/places/entities/place.entity';
import { User } from '../../../modules/users/entities/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 1000 })
  text: string;

  @Column({ type: 'int' })
  @Check('rating > 0 AND rating <= 5')
  rating: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinTable({
    name: 'user_id',
  })
  user: User;

  @ManyToOne(() => Place, (place) => place.id)
  @JoinTable({
    name: 'place_id',
  })
  place: Place;

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
}
