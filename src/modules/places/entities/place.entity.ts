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

import { CommonEntity } from '../../../shared/common';
import {
  FileInterface,
  PlaceInterface,
  UserInterface,
  CommentInterface,
} from '../../../shared/interfaces';
import { Cities, PlaceTypes } from '../../../shared/constants';
import { User } from '../../../modules/users/entities/user.entity';
import { Comment } from '../../../modules/comments/entities/comment.entity';
import { File } from '../../../modules/files/entities/file.entity';

@Entity('places')
export class Place extends CommonEntity implements PlaceInterface {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column({ default: false })
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

  @Column({ enum: Cities })
  city: string;

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
}
