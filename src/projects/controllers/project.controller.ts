import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { ProjectDto, updateProjectDto } from '../dto/project.dto';
import { ProjectsEntity } from '../entities/projects.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccesslevelGuard } from 'src/auth/guards/accesslevel.guard';
import { AccessLevel } from 'src/auth/decorators/access.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiBody, ApiHeader, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicAccesss } from 'src/auth/decorators/public.decorator';

@ApiTags('Projects')
@Controller('project')
@UseGuards(AuthGuard, RolesGuard, AccesslevelGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiProperty({ name: 'userId', required: true })
  @Roles('CREATOR')
  @Post('create/userOwner/:userId')
  public async createProject(
    @Body() body: ProjectDto,
    @Param('userId') userId: string,
  ) {
    return await this.projectService.createProject(body, userId);
  } 
  @Get('all')
  public async getAllProject(): Promise<ProjectsEntity[]> {
    return await this.projectService.findAllProjects();
  }

  @ApiProperty({ name: 'projectId', required: true })
  @Get('find/:projectId')
  public async getProjectById(@Param('projectId') id: string) {
    return await this.projectService.findProjectById(id);
  }

  @ApiProperty({ name: 'projectId', required: true })
  @AccessLevel(50)
  @Put('update/:projectId')
  public async updateProject(
    @Param('projectId') id: string,
    @Body() body: updateProjectDto,
  ) {
    return await this.projectService.updateProject(id, body);
  }

  @PublicAccesss()
  @Get('list/api')
  public async getApiData() {
    return await this.projectService.getApiData();
  }
}
