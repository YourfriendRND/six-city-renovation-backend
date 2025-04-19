import { PlaceTypes } from '../constants';
import { UserInterface } from './user.interface';
import { CommentInterface } from './comment.interface';
import { FileInterface } from './file.interface';

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
  city: string;
  latitude: number;
  longitude: number;
  createdAt?: Date;
  updatedAt?: Date;
  host: UserInterface;
  comments?: CommentInterface[];
  images: FileInterface[] | string[];
  preview: FileInterface | string;
}
