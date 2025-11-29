import { CommentInterface } from './comment.interface';
import { UserInterface } from './user.interface';
import { FileInterface } from './file.interface';
import { CityInterface } from './city.interface';
import { PlaceTypes } from '@libs/constants';

export interface PlaceInterface {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  type: PlaceTypes;
  bedrooms: number;
  adultsCount: number;
  price: number;
  features: string[] | null;
  city: CityInterface;
  latitude: number;
  longitude: number;
  createdAt?: Date;
  updatedAt?: Date;
  host: UserInterface;
  comments?: CommentInterface[];
  images: FileInterface[] | string[];
  preview: FileInterface | string;
}
