import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from './modules/util/util.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventModule } from './modules/event/event.module';
import { HistoryVisitingEventsModule } from './modules/history-visiting-events/history-visiting-events.module';
import { ConfirmVisitingEventsModule } from './modules/confirm-visiting-events/confirm-visiting-events.module';
import { LoggingModule } from './modules/logging/logging.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UtilsModule,
    AuthModule,
    EventModule,
    HistoryVisitingEventsModule,
    ConfirmVisitingEventsModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
