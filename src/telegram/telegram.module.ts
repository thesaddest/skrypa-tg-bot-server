import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { TelegramService } from './telegram.service';

@Module({
  providers: [TelegramService, ConfigService],
  exports: [TelegramService],
})
export class TelegramModule {}
