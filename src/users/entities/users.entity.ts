import { BaseEntity } from '../../config/base.entity';
import { ROLES } from '../../constants/roles';
import { IUser } from '../../interfaces/user.interface';
import { Column, Entity, OneToMany } from 'typeorm';
import { UsersProjectsEntity } from './usersProjects.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class UsersEntity extends BaseEntity implements IUser {
  @Column({
    nullable:false,
  })
  firstName: string;
  
  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ROLES,
  })
  role: ROLES;

  @OneToMany(
    () => UsersProjectsEntity,
    (usersProjectsEntity) => usersProjectsEntity.user
  )
  projectsIncludes: UsersProjectsEntity[];
}
