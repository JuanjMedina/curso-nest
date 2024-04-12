import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { TaskDto } from '../dto/task.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccesslevelGuard } from 'src/auth/guards/accesslevel.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard,RolesGuard,AccesslevelGuard)
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  public async getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Get('task/:taskId')
  public async getTaskById(@Param('taskId') taskId: string) {
    return this.taskService.getTaskById();
  }
  @Post('create/project/:projectId')
  public async createTask(
    @Body() body: TaskDto,
    @Param('projectId') projectId: string,
  ) {
    return this.taskService.createTask(body, projectId);
  }

  @Delete('delete/:taskId')
  public async deleteTask(@Param('taskId') taskId: string) {
    return this.taskService.deleteTask();
  }

  @Put('update/:taskId')
  public async updateTask(@Param('taskId') taskId: string, @Body() body: any) {
    return this.taskService.updateTask();
  }
}
