import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  findAll() {
    return this.userService.findAll();
  }
}
