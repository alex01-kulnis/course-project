import { Module } from '@nestjs/common';
import { HistoryVisitingEventsService } from './history-visiting-events.service';
import { HistoryVisitingEventsController } from './history-visiting-events.controller';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule],
  controllers: [HistoryVisitingEventsController],
  providers: [HistoryVisitingEventsService],
  exports: [HistoryVisitingEventsService],
})
export class HistoryVisitingEventsModule {}
