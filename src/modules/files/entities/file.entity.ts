import { Entity, Column, ManyToMany } from 'typeorm';

import { CommonEntity } from '../../../shared/common';
import { FileInterface } from 'src/shared/interfaces';
import { Place } from '../../../modules/places/entities/place.entity';

@Entity('files')
export class File extends CommonEntity implements FileInterface {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mimetype: string;

  @Column({ type: 'int', default: 0 })
  size: number;

  @Column({ name: 'is_private', default: false })
  isPrivate: boolean;

  @ManyToMany(() => Place, (place) => place.images)
  places?: Place[];
}
