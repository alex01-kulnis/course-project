import { IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsOptional()
  id_event: number;

  @IsOptional()
  id_creator: number;

  @IsOptional()
  id_user: number;

  name_event: string;
  place_event: string;
  data_and_time_event: string;
  max_participants_event: number;
}
