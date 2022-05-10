import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { HistoryVisitingEventsService } from './history-visiting-events.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('api/history-visiting-events')
export class HistoryVisitingEventsController {
  constructor(
    private readonly historyVisitingEventsService: HistoryVisitingEventsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllHistoryEvents(@Request() req: any) {
    const tokenData = req.user;
    return this.historyVisitingEventsService.findAllHistoryEvents(
      tokenData.id_user,
    );
  }

  @Get('all-history')
  getAllHistory() {
    return this.historyVisitingEventsService.getAllHistory();
  }

  @Get('statistics')
  getStatistics() {
    return this.historyVisitingEventsService.getStatistics();
  }
}
