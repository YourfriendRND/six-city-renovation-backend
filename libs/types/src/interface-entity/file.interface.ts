import { PlaceInterface } from './place.interface';

export interface FileInterface {
  id: string;
  name: string;
  url: string;
  mimetype?: string;
  size?: number;
  createdAt?: Date;
  updatedAt?: Date;
  places?: PlaceInterface[];
}
