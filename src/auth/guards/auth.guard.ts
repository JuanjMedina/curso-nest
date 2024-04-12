import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from 'src/constants/key-decorator';
import { UsersService } from 'src/users/services/users.service';
import { IUseToken } from '../interfaces/auth.interfaces';
import { useToken } from 'src/utils/use.token';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) return true;
    const req = context.switchToHttp().getRequest<Request>();
    if(!req.headers.authorization) throw new UnauthorizedException('Invalid Token');
    let token = req.headers.authorization.split(' ')[1];
    if (!token) throw new UnauthorizedException('Invalid Token');

    const manageToken: IUseToken | string = useToken(token);
    if (typeof manageToken === 'string')
      throw new UnauthorizedException(manageToken);
    if (manageToken.exExpired === true) throw new UnauthorizedException('Token Expired');

    const { sub } = manageToken;
    const user = await this.userService.findUserById(sub);
    if (!user) throw new UnauthorizedException('Invalid User');

    req.idUser = user.id;
    req.roleUser = user.role;
    return true;
  }
}
