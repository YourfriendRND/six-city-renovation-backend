import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';

import {
  CommonEntity,
  FileInterface,
  PlaceInterface,
  UserInterface,
  CommentInterface,
  CityInterface,
} from '@libs/types';
import { User } from '../../users/entities/user.entity';
import { File } from '../../files/entities/file.entity';
import { City } from './city.entity';
import { PlaceTypes } from '@libs/constants';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('places')
export class Place extends CommonEntity implements PlaceInterface {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column({ default: false, name: 'is_premium' })
  isPremium: boolean;

  @Column({
    type: 'enum',
    enum: PlaceTypes,
    default: PlaceTypes.Appartment,
  })
  type: PlaceTypes;

  @Column({ type: 'int', default: 1 })
  bedrooms: number;

  @Column({ name: 'adults_count', type: 'int', default: 1 })
  adultsCount: number;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'jsonb', nullable: true })
  features: string[] | null;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  longitude: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'host_id' })
  host: UserInterface;

  @OneToMany(() => Comment, (comment) => comment.id)
  comments?: CommentInterface[];

  @ManyToMany(() => File, (file) => file.id)
  @JoinTable({
    name: 'files_places',
    joinColumn: {
      name: 'place_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'file_id',
      referencedColumnName: 'id',
    },
  })
  images: FileInterface[];

  @OneToOne(() => File, (file) => file.id)
  @JoinColumn({ name: 'preview_id' })
  preview: FileInterface;

  @ManyToOne(() => City, (city) => city, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'city_id' })
  city: CityInterface;
}
