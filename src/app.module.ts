import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ProvidersModule } from './providers/providers.module';

let path = ''  
if (process.env.NODE_ENV === 'development') {
  path= `.${process.env.NODE_ENV.trim()}.env`;
}else{
  path = '.env'
}
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),
    UsersModule,
    ProjectsModule,
    AuthModule,
    TasksModule,
    ProvidersModule,
  ],
})
export class AppModule {}
