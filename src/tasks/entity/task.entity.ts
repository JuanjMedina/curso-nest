import { BaseEntity } from 'src/config/base.entity';
import { STATUS_TASK } from 'src/constants/status-task';

import { ProjectsEntity } from 'src/projects/entities/projects.entity';
import { Column, Entity, ManyToOne } from 'typeorm';


@Entity({ name: 'task' })
export class TaskEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: STATUS_TASK
  })
  status: STATUS_TASK;

  @Column()
  responsableName: string;
  
  @ManyToOne(() => ProjectsEntity, (project) => project.tasks)
  project: ProjectsEntity;
}
