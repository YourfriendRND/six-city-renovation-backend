import { OmitType } from '@nestjs/swagger';

import { CreateUserDTO } from '../users';

export class LoginDTO extends OmitType(CreateUserDTO, ['name']) {}
