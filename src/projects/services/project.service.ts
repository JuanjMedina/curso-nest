import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsEntity } from '../entities/projects.entity';
import { Repository } from 'typeorm';
import { ProjectDto, updateProjectDto } from '../dto/project.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { UsersProjectsEntity } from 'src/users/entities/usersProjects.entity';
import { ACCESS_LEVEL } from 'src/constants/roles';
import { UsersService } from 'src/users/services/users.service';
import { HttpCustomService } from 'src/providers/providers.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private readonly projectRepository: Repository<ProjectsEntity>,
    @InjectRepository(UsersProjectsEntity)
    private readonly usersProjectsRepository: Repository<UsersProjectsEntity>,
    private readonly userService: UsersService,
    private readonly httpCustonService: HttpCustomService,
  ) {}

  public async createProject(
    body: ProjectDto,
    userId: string,
  ): Promise<ProjectsEntity> {
    try {
      const project = await this.projectRepository.save(body);
      const user = await this.userService.findUserById(userId);
      await this.usersProjectsRepository.save({
        accessLevel: ACCESS_LEVEL.OWNER,
        user,
        project,
      });
      if (!project) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se pudo crear el proyecto',
        });
      }
      const projectCreated = await this.projectRepository
        .createQueryBuilder('projects')
        .where({
          id: project.id,
        })
        .leftJoinAndSelect('projects.usersIncludes', 'usersIncludes')
        .leftJoinAndSelect('usersIncludes.user', 'user')
        .getOne();

      return projectCreated;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findAllProjects(): Promise<ProjectsEntity[]> {
    try {
      const projects: ProjectsEntity[] = await this.projectRepository.find();
      if (projects.length === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontro un resultado para la busqueda',
        });
      }
      return projects;
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  public async findProjectById(id: string) {
    try {
      const project = await this.projectRepository
        .createQueryBuilder('projects')
        .where({ id })
        .leftJoinAndSelect('projects.usersIncludes', 'usersIncludes')
        .leftJoinAndSelect('usersIncludes.user', 'user')
        .getOne();
      if (!project) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontro un resultado para la busqueda',
        });
      }
      return project;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateProject(id: string, body: updateProjectDto) {
    try {
      const project = await this.projectRepository.update(id, body);
      if (project.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se pudo actualizar el proyecto indicado',
        });
      }
      return project;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteProject(id: number) {}

  public async getApiData() {
    return await this.httpCustonService.findAll();
  }
}
