import { LoggingModule } from './../logging/logging.module';
import { ConfirmVisitingEventsModule } from './../confirm-visiting-events/confirm-visiting-events.module';
import { HistoryVisitingEventsModule } from './../history-visiting-events/history-visiting-events.module';
import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    HistoryVisitingEventsModule,
    ConfirmVisitingEventsModule,
    LoggingModule,
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
