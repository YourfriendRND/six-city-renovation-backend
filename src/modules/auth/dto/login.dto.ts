import { OmitType } from '@nestjs/swagger';

import { CreateUserDTO } from './create-user.dto';

export class LoginDTO extends OmitType(CreateUserDTO, ['name']) {}
