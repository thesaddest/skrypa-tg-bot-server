import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Notification, NotificationType } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private readonly dbService: DbService) {}

  async createNotification(
    userId: string,
    message: string,
    type: NotificationType,
  ): Promise<Notification> {
    return this.dbService.notification.create({
      data: { userId, type, message },
    });
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    return this.dbService.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async getNotificationById(notificationId: string): Promise<Notification> {
    return this.dbService.notification.findUnique({
      where: { id: notificationId },
    });
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return this.dbService.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
