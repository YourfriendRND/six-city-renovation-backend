import { PlaceInterface } from './place.interface';

export interface FileInterface {
  id: string;
  name: string;
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
  places?: PlaceInterface[];
}
