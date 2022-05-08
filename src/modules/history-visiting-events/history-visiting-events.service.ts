import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Pool } from 'pg';
import { DatabaseService } from '../database/Database.service';
import { HistoryVisitingEvent } from './models/history-visiting-event.entity';
import { StatisticEvent } from './models/statistic-event';

@Injectable()
export class HistoryVisitingEventsService {
  private dbContext: Pool;
  constructor(private readonly databaseService: DatabaseService) {
    this.dbContext = this.databaseService.getContext();
  }

  async findAllHistoryEvents(user_id: number) {
    let event: any;
    await this.dbContext
      .query(
        'select id_event, id_creator, id_user, name_event, place_event, data_and_time_event, max_participants_event from historyvisiting where id_user = $1',
        [user_id],
      )
      .then((result) => {
        event = plainToInstance(HistoryVisitingEvent, result.rows);
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });
    return event;
  }

  async addInHistorytEvent(userId: number, event: any) {
    await this.dbContext
      .query(
        'insert into historyvisiting(id_event, id_creator, id_user, name_event, place_event, data_and_time_event, max_participants_event) values($1, $2, $3, $4, $5, $6, $7)',
        [
          event.id_event,
          event.id_creator,
          event.id_user,
          event.name_event,
          event.place_event,
          event.data_and_time_event,
          event.max_participants_event,
        ],
      )
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });

    return 'event удалён';
  }

  async addInHistorytEventWithToken(userId: number, event: any) {
    await this.dbContext
      .query(
        'insert into historyvisiting(id_event, id_creator, id_user, name_event, place_event, data_and_time_event, max_participants_event) values($1, $2, $3, $4, $5, $6, $7)',
        [
          event.id_event,
          event.id_creator,
          userId,
          event.name_event,
          event.place_event,
          event.data_and_time_event,
          event.max_participants_event,
        ],
      )
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });

    return 'event удалён';
  }

  async getStatistics() {
    let events: any;
    await this.dbContext
      .query(
        'select id_event, name_event, count(*) AS amount from historyvisiting GROUP BY id_event, name_event ORDER BY id_event ASC',
      )
      .then((result) => {
        events = plainToInstance(StatisticEvent, result.rows);
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });
    return events;
  }
}
