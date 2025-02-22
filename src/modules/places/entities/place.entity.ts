import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { Expose } from 'class-transformer';

import { Cities, PlaceTypes } from '../../../shared/constants';
import { User } from '../../../modules/users/entities/user.entity';
import { Comment } from '../../../modules/comments/entities/comment.entity';
import { File } from '../../../modules/files/entities/file.entity';

@Entity('places')
export class Place {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

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

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'host_id' })
  host: User | string;

  @OneToMany(() => Comment, (comment) => comment.id)
  comments?: Comment[];

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
  images: File[] | string[];

  @OneToOne(() => File, (file) => file.id)
  @JoinColumn({ name: 'preview_id' })
  preview: File | string;
}
