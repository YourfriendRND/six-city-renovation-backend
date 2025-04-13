import { CommonEntityInterface } from './common-entity.interface';
import { Roles } from '../constants';
import { PlaceInterface } from './place.interface';
import { CommentInterface } from './comment.interface';

export interface UserInterface extends CommonEntityInterface {
  name: string;
  isPro: boolean;
  email: string;
  password: string;
  avatarUrl: string;
  role: Roles;
  lastLoginAt: Date | null;
  places: PlaceInterface[];
  comments: CommentInterface[];
}
