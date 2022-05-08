import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LoggingService } from './logging.service';

@Module({
  imports: [DatabaseModule],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
