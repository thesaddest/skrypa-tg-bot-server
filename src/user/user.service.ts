import { Injectable, Logger } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Prisma, User } from '@prisma/client';

type UserWithCourses = Prisma.UserGetPayload<{
  include: { coursesBought: true };
}>;

@Injectable()
export class UserService {
  constructor(
    private readonly dbService: DbService,
    private readonly logger: Logger,
  ) {}

  async getUserByTelegramId(telegramId: number): Promise<User | null> {
    this.logger.debug(`Getting user with telegramId: ${telegramId}`);
    return this.dbService.findUnique(this.dbService.user, {
      where: { telegramId },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    this.logger.debug(`Creating user with data: ${JSON.stringify(data)}`);
    return this.dbService.create(this.dbService.user, {
      data,
    });
  }

  async updateUserCourses(userId: string, courseIds: string[]): Promise<User> {
    this.logger.debug(
      `Updating coursesBought for userId: ${userId} with courseIds: ${courseIds}`,
    );

    return await this.dbService.update(this.dbService.user, {
      where: { id: userId },
      data: {
        coursesBought: {
          connect: courseIds.map((courseId) => ({ id: courseId })),
        },
        hasPurchasedCourses: true,
      },
    });
  }

  async getUserById(userId: string): Promise<UserWithCourses | null> {
    this.logger.debug(`Getting user with id: ${userId}`);

    const user = this.dbService.findUnique(this.dbService.user, {
      where: { id: userId },
      include: { coursesBought: true },
    });

    return user as unknown as UserWithCourses;
  }
}
