import { Global, Module } from '@nestjs/common';
import { HttpCustomService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { HttpModule } from '@nestjs/axios';
@Global()
@Module({
  imports: [HttpModule],
  providers: [HttpCustomService],
  exports: [HttpCustomService, HttpModule],
})
export class ProvidersModule {}
