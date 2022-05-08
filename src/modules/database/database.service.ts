import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {}

  getContext() {
    return new Pool({
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      database: this.configService.get('DB_NAME'),
    });
  }
}
