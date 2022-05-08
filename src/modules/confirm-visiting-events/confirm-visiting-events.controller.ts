import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { ConfirmVisitingEventsService } from './confirm-visiting-events.service';
import { CreateConfirmVisitingEventDto } from './dto/create-confirm-visiting-event.dto';

@Controller('api/confirm-visiting-events')
export class ConfirmVisitingEventsController {
  constructor(
    private readonly confirmVisitingEventsService: ConfirmVisitingEventsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  confirmInvite(
    @Body() сreateConfirmVisitingEventDto: CreateConfirmVisitingEventDto,
    @Request() req: any,
  ) {
    const tokenData = req.user;
    return this.confirmVisitingEventsService.confirmInvite(
      tokenData,
      сreateConfirmVisitingEventDto,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getConfirmEvents(@Request() req: any) {
    const tokenData = req.user;
    return this.confirmVisitingEventsService.getConfirmEvents(
      tokenData.id_user,
    );
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  deleteConfirmVisitingEvent(
    @Body() сreateConfirmVisitingEventDto: CreateConfirmVisitingEventDto,
    @Request() req: any,
  ) {
    const tokenData = req.user;
    return this.confirmVisitingEventsService.deleteConfirmVisitingEvent(
      tokenData,
      сreateConfirmVisitingEventDto,
    );
  }
}
