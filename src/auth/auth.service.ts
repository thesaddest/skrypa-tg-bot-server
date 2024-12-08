import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(telegramId: number): Promise<User> {
    const user = await this.userService.getUserByTelegramId(telegramId);
    if (user) {
      return user;
    }
    throw new UnauthorizedException('User not found');
  }

  async login(user: User) {
    const telegramId =
      typeof user.telegramId === 'bigint'
        ? user.telegramId.toString()
        : user.telegramId;

    const payload = {
      username: user.username,
      sub: telegramId, // 'sub' is short for subject, often used to store the user ID in a JWT
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
