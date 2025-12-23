import { CommonEntityInterface } from './common-entity.interface';
import { CommentInterface } from './comment.interface';
import { PlaceInterface } from './place.interface';
import { SessionInterface } from './session.interface';
import { Roles } from '@libs/constants';
import { EconfirmationInterface } from './econfirmation.interface';

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
  sessions?: SessionInterface[];
  sessionId?: string;
  emailConfirmations: EconfirmationInterface[];
}
