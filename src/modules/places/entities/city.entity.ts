import { Column, Entity, OneToMany } from 'typeorm';

import { CommonEntity } from '../../../shared/common';
import { CityInterface, PlaceInterface } from '../../../shared/interfaces';
import { Place } from './place.entity';

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
}
