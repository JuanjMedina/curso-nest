import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import {NestExpressApplication} from '@nestjs/platform-express'
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    snapshot: true,
  });
  app.disable('x-powered-by')
  app.use(morgan('dev'));
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({}));
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  console.log('process.env.NODE_ENV', process.env.NODE_ENV)
  const config = new DocumentBuilder()
    .setTitle('TASK Api')
    .setDescription('Aplicacion de tareas ')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', description: 'Bearer token' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
