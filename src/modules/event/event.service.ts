import { LoggingService } from './../logging/logging.service';
import { ConfirmVisitingEventsService } from './../confirm-visiting-events/confirm-visiting-events.service';
import { SearchEventDto } from './dto/search-event.dto';
import { HistoryVisitingEventsService } from './../history-visiting-events/history-visiting-events.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Pool } from 'pg';
import { DatabaseService } from '../database/Database.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventModel } from './models/event.model';
import { ConfirmVisitingEvent } from '../confirm-visiting-events/models/confirm-visiting-event.entity';
import { CreateConfirmVisitingEventDto } from '../confirm-visiting-events/dto/create-confirm-visiting-event.dto';
import { HistoryVisitingEvent } from '../history-visiting-events/models/history-visiting-event.entity';
import { LogActionType } from '../logging/entities/log-action-types';

@Injectable()
export class EventService {
  private dbContext: Pool;
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly historyVisitingEventsService: HistoryVisitingEventsService,
    private readonly loggingService: LoggingService,
    private readonly confirmVisitingEventsService: ConfirmVisitingEventsService,
  ) {
    this.dbContext = this.databaseService.getContext();
  }

  async createEvent(tokenData: any, createEventDto: CreateEventDto) {
    let event: EventModel;

    await this.dbContext
      .query('CALL insert_events($1, $2, $3, $4, $5, $6)', [
        tokenData.id_user,
        tokenData.id_user,
        createEventDto.name_event,
        createEventDto.place_event,
        createEventDto.data_and_time_event,
        +createEventDto.max_participants_event,
      ])
      .then(async () => {
        event = await this.findEvent(createEventDto.name_event);
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });

    await this.historyVisitingEventsService.addInHistorytEventWithToken(
      tokenData.id_user,
      event,
    );

    await this.loggingService.actionLogger(
      createEventDto,
      LogActionType.create,
      tokenData,
    );

    return event;
  }

  async applyEvent(
    token: any,
    createConfirmVisitingEventDto: CreateConfirmVisitingEventDto,
  ) {
    if (
      (await this.countOfParticipants(
        +createConfirmVisitingEventDto.id_event,
      )) >= +createConfirmVisitingEventDto.max_participants_event
    ) {
      throw new HttpException(`Мест больше нету`, HttpStatus.BAD_REQUEST);
    }

    if (
      await this.alreadyParticipatingOrWaiting(
        +token.id_user,
        +createConfirmVisitingEventDto.id_event,
      )
    ) {
      throw new HttpException(
        `Вы уже участвуте или ожидаете`,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.confirmVisitingEventsService.addInConfirmVisiting(
      token,
      createConfirmVisitingEventDto,
    );

    await this.loggingService.actionLogger(
      createConfirmVisitingEventDto,
      LogActionType.apply,
      token,
    );

    return 'Ожидайте подтверждения или отклонения';
  }

  async findEvent(name_event: string) {
    let event: EventModel;
    await this.dbContext
      .query('select * from get_find_event_by_name($1)', [name_event])
      .then((result) => {
        event = plainToInstance(EventModel, result.rows[0]);
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });
    return event;
  }

  async findAllEvents() {
    let events;
    await this.dbContext
      .query('SELECT * from get_events()')
      .then((result) => {
        events = plainToInstance(EventModel, result.rows);
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });
    return events;
  }

  async findEventForSearching(searchEventDto: SearchEventDto) {
    let event: any;
    await this.dbContext
      .query('select * from get_find_event_by_name($1) ', [
        searchEventDto.name_event,
      ])
      .then((result) => {
        event = plainToInstance(EventModel, result.rows);
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });
    return event;
  }

  async countOfParticipants(id_event: number) {
    let event: EventModel[];
    await this.dbContext
      .query('select * from get_count_of_participants($1) ', [id_event])
      .then((result) => {
        event = plainToInstance(EventModel, result.rows);
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });

    return event.length;
  }

  async alreadyParticipatingOrWaiting(userId: number, event_id: number) {
    let countOfConfirm: ConfirmVisitingEvent[];
    let countOfHistory: HistoryVisitingEvent[];
    await this.dbContext
      .query(
        'select * from get_already_participating_in_confirmvisiting($1,$2)',
        [userId, event_id],
      )
      .then((countOfConfirmEvents) => {
        countOfConfirm = plainToInstance(
          ConfirmVisitingEvent,
          countOfConfirmEvents.rows,
        );
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });

    await this.dbContext
      .query(
        'select * from get_already_participating_in_historyvisiting($1,$2)',
        [userId, event_id],
      )
      .then((result) => {
        countOfHistory = plainToInstance(HistoryVisitingEvent, result.rows);
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });

    if (+countOfConfirm.length > 0 || +countOfHistory.length) {
      return true;
    }
    return false;
  }
}
