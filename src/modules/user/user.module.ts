import { DatabaseService } from './../database/database.service';
import { UtilsModule } from './../util/util.module';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, UtilsModule],
  controllers: [UserController],
  providers: [UserService, DatabaseService],
  exports: [UserService],
})
export class UserModule {}
