import { LoggingModule } from './../logging/logging.module';
import { HistoryVisitingEventsModule } from './../history-visiting-events/history-visiting-events.module';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfirmVisitingEventsService } from './confirm-visiting-events.service';
import { ConfirmVisitingEventsController } from './confirm-visiting-events.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    HistoryVisitingEventsModule,
    LoggingModule,
  ],
  controllers: [ConfirmVisitingEventsController],
  providers: [ConfirmVisitingEventsService],
  exports: [ConfirmVisitingEventsService],
})
export class ConfirmVisitingEventsModule {}
