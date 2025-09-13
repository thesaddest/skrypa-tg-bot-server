import { Body, Controller, Post } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('webhook')
  async handleWebhook(@Body() update: TelegramBot.Update) {
    await this.telegramService.handleWebhookUpdate(update);
    return { ok: true };
  }
}
