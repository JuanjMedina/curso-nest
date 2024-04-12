import { SetMetadata } from '@nestjs/common';
import { ACCESS_LEVEL_KEY, PUBLIC_KEY } from 'src/constants/key-decorator';

export const AccessLevel = (level:number) => SetMetadata(ACCESS_LEVEL_KEY, level);
