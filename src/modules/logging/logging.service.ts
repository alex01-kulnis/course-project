import { LogActionType } from './entities/log-action-types';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseService } from '../database/Database.service';

@Injectable()
export class LoggingService {
  private dbContext: Pool;
  constructor(private readonly databaseService: DatabaseService) {
    this.dbContext = this.databaseService.getContext();
  }

  async actionLogger(event: any, action: LogActionType, tokenData: any) {
    const date = new Date();
    let message = `User with id :${tokenData.id_user}, `;
    switch (action) {
      case LogActionType.create: {
        message += `create new event with name '${event.name_event}'`;
        break;
      }
      case LogActionType.apply: {
        message += `apply on event with name '${event.name_event}' `;
        break;
      }
      case LogActionType.confirm: {
        message += `confirm invite from user with id :${event.id_user} on event with name '${event.name_event}' `;
        break;
      }
      case LogActionType.refuse: {
        message += `refuse invite from userId : ${event.id_user} on event with name '${event.name_event}' `;
        break;
      }
    }

    await this.dbContext
      .query('CALL insert_events_logging($1, $2)', [message, date.toString()])
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });
  }
}
