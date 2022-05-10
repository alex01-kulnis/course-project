import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseService } from '../database/database.service';
import { UserModel } from './models/user.model';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  private dbContext: Pool;

  constructor(private readonly databaseService: DatabaseService) {
    this.dbContext = this.databaseService.getContext();
  }

  async findUser(login: string) {
    let user: UserModel;
    await this.dbContext
      .query('SELECT * from get_user_by_login($1)', [login])
      .then((result) => {
        user = plainToInstance(UserModel, result.rows[0]);
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });
    return user;
  }

  async findAll() {
    const res = (await this.dbContext.query('select * from users')).rows;
    return res;
  }
}
