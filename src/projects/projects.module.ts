import { Module } from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsEntity } from './entities/projects.entity';
import { ProjectController } from './controllers/project.controller';
import { UsersProjectsEntity } from 'src/users/entities/usersProjects.entity';
import { UsersService } from 'src/users/services/users.service';
import { ProvidersModule } from 'src/providers/providers.module';
import { HttpCustomService } from 'src/providers/providers.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, UsersService, HttpCustomService],
  imports: [
    TypeOrmModule.forFeature([ProjectsEntity, UsersProjectsEntity]),
    ProvidersModule,
  ],
})
export class ProjectsModule {}
