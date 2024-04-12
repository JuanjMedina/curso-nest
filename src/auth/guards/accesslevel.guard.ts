import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  ACCESS_LEVEL_KEY,
  ADIMIN_KEY,
  PUBLIC_KEY,
  ROLES_KEY,
} from 'src/constants/key-decorator';
import { ROLES } from 'src/constants/roles';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AccesslevelGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    const roles = this.reflector.get<Array<keyof typeof ROLES>>(
      ROLES_KEY,
      context.getHandler(),
    );

    const accessLevel = this.reflector.get<number>(
      ACCESS_LEVEL_KEY,
      context.getHandler(),
    );

    const admin = this.reflector.get<string>(ADIMIN_KEY, context.getHandler());

    const req = context.switchToHttp().getRequest<Request>();
    const { roleUser, idUser } = req;

    if (accessLevel === undefined) {
      if (roles === undefined) {
        if (!admin) {
          return true;
        } else if (admin && roleUser === admin) {
          return true;
        }
        throw new UnauthorizedException(
          'No tienes permisos para la operacion! ',
        );
      }
    }

    if (roleUser === ROLES.ADMIN || roleUser === ROLES.CREATOR) return true;

    const user = await this.userService.findUserById(idUser);
    const UserExistInProject = user.projectsIncludes.find(
      (project) => project.project.id === req.params.projectId,
    );
    console.log(accessLevel);
    console.log(UserExistInProject);
    if (!UserExistInProject)
      throw new UnauthorizedException('no perteneces al proyecto');

    if (accessLevel !== UserExistInProject.accessLevel)
      throw new UnauthorizedException(
        'No tienes el nivel de acceso necesario ',
      );
    return true;
  }
}
