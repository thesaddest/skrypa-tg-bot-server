import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import { WebAppInitData } from '../telegram/telegram.types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(
    @Body() webAppInitData: { webAppInitData: string },
    @Res() res: Response,
  ) {
    const params = new URLSearchParams(webAppInitData.webAppInitData);
    const data: { [key: string]: string } = {};

    for (const [key, value] of params.entries()) {
      data[key] = value;
    }

    const { hash, ...telegramData } = data;

    if (!hash) {
      throw new InternalServerErrorException('Hash is missing in the data');
    }

    const isValid = this.verifyTelegramData(telegramData, hash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid Telegram data');
    }

    const userJson = data.user;
    if (!userJson) {
      throw new InternalServerErrorException('User data is missing');
    }

    let userData: WebAppInitData['user'];
    try {
      userData = JSON.parse(userJson);
    } catch (e) {
      throw new InternalServerErrorException('Invalid user data format');
    }

    let user = await this.userService.getUserByTelegramId(userData.id);
    if (!user) {
      const {
        id: telegramId,
        last_name,
        first_name,
        is_bot,
        language_code,
        username,
      } = userData;
      // Create user if not exists
      user = await this.userService.createUser({
        telegramId,
        username,
        firstName: first_name,
        lastName: last_name,
        languageCode: language_code,
        isBot: is_bot,
      });
    }

    const token = await this.authService.login(user);

    const sanitizedUser = {
      ...user,
      telegramId:
        typeof user.telegramId === 'bigint'
          ? user.telegramId.toString()
          : user.telegramId,
    };

    // Send response with sanitized user
    res.json({
      user: sanitizedUser,
      accessToken: token.access_token,
      success: true,
    });
  }

  private verifyTelegramData(
    telegramData: { [p: string]: string },
    hash: string,
  ): boolean {
    const botToken = this.configService.get<string>('tg.api_token');
    if (!botToken) {
      throw new InternalServerErrorException('Bot token is not defined');
    }

    if (!hash) {
      throw new InternalServerErrorException('Hash is missing in the data');
    }

    // Compute the secret key
    const secretKey = createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Clone webAppInitData to avoid mutation and exclude hash/signature
    const checkString = Object.keys(telegramData)
      .sort()
      .filter((key: string) => telegramData[key as keyof typeof telegramData])
      .map(
        (key: string) =>
          `${key}=${telegramData[key as keyof typeof telegramData]}`,
      )
      .join('\n');

    // Compute the hash
    const computedHash = createHmac('sha256', secretKey)
      .update(checkString)
      .digest('hex');

    return computedHash === hash;
  }
}
