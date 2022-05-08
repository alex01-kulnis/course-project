import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UtilsModule } from '../util/util.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    UtilsModule,
    UserModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
