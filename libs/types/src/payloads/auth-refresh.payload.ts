import { UserInterface } from '../interface-entity';
import { AuthSessionPayload } from './auth-session.payload';

export type AuthRefreshPayload = AuthSessionPayload & UserInterface;
