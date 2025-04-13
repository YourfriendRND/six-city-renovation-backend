import {
  Entity,
  Column,
  ManyToMany,
} from 'typeorm';

import { CommonEntity } from '../../../shared/common';
import { FileInterface } from 'src/shared/interfaces';
import { Place } from '../../../modules/places/entities/place.entity';

@Entity('files')
export class File extends CommonEntity implements FileInterface {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column()
  url: string;

  @ManyToMany(() => Place, (place) => place.images)
  places?: Place[];
}
