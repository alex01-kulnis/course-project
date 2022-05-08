import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class UtilsService {
  private readonly SECRET = 'pa$$w0Rd';

  hashString(data: string) {
    return crypto.createHmac('sha256', this.SECRET).update(data).digest('hex');
  }
}
