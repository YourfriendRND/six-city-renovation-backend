import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { CommonEntity } from '@libs/types';
import { Place } from './place.entity';
import { File } from '../../files/entities/file.entity';
import { CityInterface, FileInterface, PlaceInterface } from '@libs/types';

@Entity('cities')
export class City extends CommonEntity implements CityInterface {
  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  longitude: number;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => Place, (place) => place)
  places: PlaceInterface[];

  @OneToOne(() => File, (file) => file.id)
  @JoinColumn({ name: 'preview_id' })
  preview: FileInterface;
}
