import { SetMetadata } from '@nestjs/common';
import { ADIMIN_KEY } from 'src/constants/key-decorator';
import { ROLES } from 'src/constants/roles';

export const AdminAccess = () => SetMetadata(ADIMIN_KEY, ROLES.ADMIN);
