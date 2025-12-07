import { CommonEntityInterface } from './common-entity.interface';
import { UserInterface } from './user.interface';

export interface SessionInterface extends CommonEntityInterface {
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  user: UserInterface;
}
