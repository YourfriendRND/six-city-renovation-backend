import { CommonEntityInterface } from './common-entity.interface';
import { UserInterface } from './user.interface';

export interface EconfirmationInterface extends CommonEntityInterface {
    token: string;
    expiredAt: Date;
    isConfirmed: boolean;
    user: UserInterface;
    deletedAt?: Date | null;
}
