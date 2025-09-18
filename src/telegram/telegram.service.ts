import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { ConfigService } from '../config/config.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private readonly clientUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.bot = new TelegramBot(this.configService.get<string>('tg.api_token'), {
      polling: false,
    });
    this.clientUrl = this.configService.get<string>('app.client_url');
  }

  async onModuleInit() {
    const webhookUrl = this.configService.get<string>('app.webhook_url');
    await this.bot.setWebHook(`${webhookUrl}/telegram/webhook`);
  }

  async handleWebhookUpdate(update: TelegramBot.Update) {
    console.log('Webhook received:', JSON.stringify(update, null, 2));

    if (update.message) {
      console.log('Message received:', update.message.text);
      await this.handleStartCommand(update.message);
    } else {
      console.log('No message in update');
    }
  }

  private async handleStartCommand(msg: TelegramBot.Message) {
    console.log('Handling start command for chat:', msg.chat.id);
    const chatId = msg.chat.id;

    await this.bot.sendMessage(
      chatId,
      'Welcome! Click the button below to open the application:',
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Open Application',
                web_app: { url: this.clientUrl },
              },
            ],
          ],
        },
      },
    );
    console.log('Message sent successfully');
  }
}
