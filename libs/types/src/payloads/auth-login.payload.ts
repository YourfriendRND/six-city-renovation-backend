import { LoginDTO } from '../dto';
import { AuthSessionPayload } from './auth-session.payload';

export type AuthLoginPayload = AuthSessionPayload & LoginDTO;
