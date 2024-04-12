import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateUserDto, UserDto, UserToProjectDTO } from '../dto/user.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { UsersProjectsEntity } from '../entities/usersProjects.entity';
import * as brcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly UserRepository: Repository<UsersEntity>,
    @InjectRepository(UsersProjectsEntity)
    private readonly UserProjectRepository: Repository<UsersProjectsEntity>,
  ) {}

  public async createUser(body: UserDto): Promise<UsersEntity> {
    try {
      const newPassword = await brcrypt.hash(
        body.password,
        Number(process.env.HASH_SALT),
      );
      body.password = newPassword;
      const userCreated = await this.UserRepository.save(body);
      delete userCreated.password;
      return userCreated;
    } catch (err) {
      throw ErrorManager.createSignatureError(err.message);
    }
  }

  public async findAll(): Promise<UsersEntity[]> {
    try {
      const users: UsersEntity[] = await this.UserRepository.find();
      if (users.length === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontro un resultado para la busqueda',
        });
      }
      return users;
    } catch (err) {
      throw ErrorManager.createSignatureError(err.message);
    }
  }

  public async findUserById(id: string): Promise<UsersEntity> {
    try {
      const user = await this.UserRepository.createQueryBuilder('users')
        .where({ id })
        .leftJoinAndSelect('users.projectsIncludes', 'projectsIncludes')
        .leftJoinAndSelect('projectsIncludes.project', 'project')
        .getOne();

      if (!user) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontro un resultado para la busqueda',
        });
      }
      return user;
    } catch (err) {
      throw ErrorManager.createSignatureError(err.message);
    }
  }

  public async updateUser(
    body: UpdateUserDto,
    id: string,
  ): Promise<UpdateResult | undefined> {
    try {
      const user = await this.UserRepository.update(id, body);
      if (user.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se pudo actualizar el usuario indicado',
        });
      }
      return user;
    } catch (err) {
      throw ErrorManager.createSignatureError(err.message);
    }
  }

  public async deleteUser(id: string): Promise<DeleteResult | undefined> {
    try {
      const user = await this.UserRepository.delete(id);
      if (user.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se pudo eliminar el usuario',
        });
      }
      return user;
    } catch (err) {
      throw ErrorManager.createSignatureError(err.message);
    }
  }

  public async addToProject(body: UserToProjectDTO) {
    try {
      return await this.UserProjectRepository.save(body);
    } catch (err) {
      throw new Error(err);
    }
  }

  public async findBy({ key, value }: { key: keyof UserDto; value: any }) {
    try {
      const user: UsersEntity = await this.UserRepository.createQueryBuilder(
        'user',
      )
        .addSelect('user.password')
        .where({ [key]: value })
        .getOne();
      return user;
    } catch (err) {
      throw ErrorManager.createSignatureError(err.message);
    }
  }
}
