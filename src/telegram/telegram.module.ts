import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

@Module({
  controllers: [TelegramController],
  providers: [TelegramService, ConfigService],
  exports: [TelegramService],
})
export class TelegramModule {}
