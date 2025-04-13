import { CommonEntityInterface } from './common-entity.interface';
import { PlaceInterface } from './place.interface';
import { UserInterface } from './user.interface';

export interface CommentInterface extends CommonEntityInterface {
  text: string;
  rating: number;
  user: UserInterface;
  place: PlaceInterface;
}
