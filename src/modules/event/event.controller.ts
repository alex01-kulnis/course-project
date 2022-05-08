import { JwtAuthGuard } from './../auth/jwt.auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { SearchEventDto } from './dto/search-event.dto';
import { CreateConfirmVisitingEventDto } from '../confirm-visiting-events/dto/create-confirm-visiting-event.dto';

@Controller('api')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('/create-event')
  @UseGuards(JwtAuthGuard)
  createEvent(@Body() createEventDto: CreateEventDto, @Request() req: any) {
    const tokenData = req.user;
    return this.eventService.createEvent(tokenData, createEventDto);
  }

  @Post('/apply-event')
  @UseGuards(JwtAuthGuard)
  applyEvent(
    @Body() createConfirmVisitingEventDto: CreateConfirmVisitingEventDto,
    @Request() req: any,
  ) {
    const tokenData = req.user;
    return this.eventService.applyEvent(
      tokenData,
      createConfirmVisitingEventDto,
    );
  }

  @Get('/events')
  @UseGuards(JwtAuthGuard)
  findAllEvents() {
    return this.eventService.findAllEvents();
  }

  @Put('/search')
  @UseGuards(JwtAuthGuard)
  findEventForSearching(@Body() searchEventDto: SearchEventDto) {
    return this.eventService.findEventForSearching(searchEventDto);
  }
}
