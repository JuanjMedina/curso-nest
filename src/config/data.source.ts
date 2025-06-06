import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

if (process.env.NODE_ENV === 'development') {
  ConfigModule.forRoot({
    envFilePath: `.${process.env.NODE_ENV.trim()}.env`,
  });
} else {
  ConfigModule.forRoot({
    envFilePath: `.env`,
    isGlobal: true,
  });
}

const configService = new ConfigService();

export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{ .ts,.js}'],
  synchronize: true,
  ssl: true,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
};

export const AppDs = new DataSource(DataSourceConfig);
