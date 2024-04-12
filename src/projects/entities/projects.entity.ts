import { TaskEntity } from 'src/tasks/entity/task.entity';
import { BaseEntity } from '../../config/base.entity';
import { UsersProjectsEntity } from '../../users/entities/usersProjects.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
@Entity({ name: 'projects' })
export class ProjectsEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(
    () => UsersProjectsEntity,
    (usersProjectsEntity) => usersProjectsEntity.project,
  )
  usersIncludes: UsersProjectsEntity[];

  @OneToMany(() => TaskEntity, (task) => task.project)
  tasks: TaskEntity[];
}
