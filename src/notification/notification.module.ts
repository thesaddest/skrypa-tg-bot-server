import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { DbModule } from '../db/db.module';
import { NotificationController } from './notification.controller';

@Module({
  imports: [DbModule],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
