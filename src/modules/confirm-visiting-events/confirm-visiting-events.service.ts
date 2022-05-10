import { LoggingService } from './../logging/logging.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Pool } from 'pg';
import { DatabaseService } from '../database/Database.service';
import { HistoryVisitingEventsService } from '../history-visiting-events/history-visiting-events.service';
import { CreateConfirmVisitingEventDto } from './dto/create-confirm-visiting-event.dto';
import { ConfirmVisitingEvent } from './models/confirm-visiting-event.entity';
import { LogActionType } from '../logging/entities/log-action-types';

@Injectable()
export class ConfirmVisitingEventsService {
  private dbContext: Pool;
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly historyVisitingEventsService: HistoryVisitingEventsService,
    private readonly loggingService: LoggingService,
  ) {
    this.dbContext = this.databaseService.getContext();
  }

  async confirmInvite(
    token: any,
    сreateConfirmVisitingEventDto: CreateConfirmVisitingEventDto,
  ) {
    this.historyVisitingEventsService.addInHistorytEvent(
      token.id_user,
      сreateConfirmVisitingEventDto,
    );

    this.deleteConfirmVisitingEvent(
      token,
      сreateConfirmVisitingEventDto,
      LogActionType.confirm,
    );

    this.loggingService.actionLogger(
      сreateConfirmVisitingEventDto,
      LogActionType.confirm,
      token,
    );

    return 'Подтверждено';
  }

  async getConfirmEvents(userId: number) {
    let confirmEvents;
    await this.dbContext
      .query('select * from get_confirim_event($1)', [userId])
      .then((result) => {
        confirmEvents = plainToInstance(ConfirmVisitingEvent, result.rows);
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });
    return confirmEvents;
  }

  async addInConfirmVisiting(
    token: any,
    createConfirmVisitingEventDto: CreateConfirmVisitingEventDto,
  ) {
    await this.dbContext
      .query('CALL insert_apply_event($1, $2, $3, $4, $5, $6, $7, $8)', [
        createConfirmVisitingEventDto.id_event,
        createConfirmVisitingEventDto.id_creator,
        token.id_user,
        createConfirmVisitingEventDto.name_event,
        createConfirmVisitingEventDto.place_event,
        createConfirmVisitingEventDto.data_and_time_event,
        createConfirmVisitingEventDto.max_participants_event,
        token.secondname,
      ])
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });
  }

  async deleteConfirmVisitingEvent(
    token: any,
    сreateConfirmVisitingEventDto?: CreateConfirmVisitingEventDto,
    action?: LogActionType,
  ) {
    await this.dbContext
      .query('CALL delete_confirm_event($1)', [
        сreateConfirmVisitingEventDto.id,
      ])
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });

    if (action == null)
      this.loggingService.actionLogger(
        сreateConfirmVisitingEventDto,
        LogActionType.refuse,
        token,
      );

    return 'event удалён';
  }
}
