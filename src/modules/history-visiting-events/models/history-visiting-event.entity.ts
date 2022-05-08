import { IsOptional } from 'class-validator';

export class HistoryVisitingEvent {
  @IsOptional()
  id: number;

  id_event: number;
  id_creator: number;

  @IsOptional()
  id_user: number;
  name_event: string;
  place_event: string;
  data_and_time_event: string;
  max_participants_event: number;
}
