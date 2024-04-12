import { Module } from '@nestjs/common';
import { TasksController } from './controller/tasks.controller';
import { TasksService } from './services/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entity/task.entity';
import { ProjectsEntity } from 'src/projects/entities/projects.entity';
import { ProjectService } from 'src/projects/services/project.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, ProjectsEntity])],
  controllers: [TasksController],
  providers: [TasksService, ProjectService],
})
export class TasksModule {}
