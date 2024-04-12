import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ADIMIN_KEY, PUBLIC_KEY, ROLES_KEY } from 'src/constants/key-decorator';
import { ROLES } from 'src/constants/roles';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    const roles = this.reflector.get<Array<keyof typeof ROLES>>(
      ROLES_KEY,
      context.getHandler(),
    );

    const admin = this.reflector.get<string>(ADIMIN_KEY, context.getHandler());

    const req = context.switchToHttp().getRequest<Request>();
    const { roleUser } = req;

    if (roles === undefined) {
      if (!admin) {
        return true;
      } else if (admin && roleUser === admin) {
        return true;
      }
      throw new UnauthorizedException('No tienes permisos para la operacion! ');
    }

    if (roleUser === ROLES.ADMIN) return true;

    const isAuth = roles.some((role) => role === roleUser);
    if (!isAuth) {
      throw new UnauthorizedException('No tienes permisos para la operacion! ');
    }

    return true;
  }
}
