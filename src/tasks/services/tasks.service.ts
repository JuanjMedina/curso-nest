import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../entity/task.entity';
import { Repository } from 'typeorm';
import { TaskDto } from '../dto/task.dto';
import { ProjectService } from 'src/projects/services/project.service';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskEntity: Repository<TaskEntity>,
    private readonly projectService: ProjectService,
  ) {}
  async createTask(body: TaskDto, projectId: string) {
    try {
      const project = await this.projectService.findProjectById(projectId);
      if (project=== undefined)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Project not found',
        });
      return this.taskEntity.save({ ...body, project });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
  getAllTasks() {}
  getTaskById() {}
  deleteTask() {}
  updateTask() {}
}
