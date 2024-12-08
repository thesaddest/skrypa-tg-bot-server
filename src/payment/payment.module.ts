import { Logger, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigService } from '../config/config.service';
import { UserModule } from '../user/user.module';
import { EventModule } from '../event/event.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [UserModule, EventModule, NotificationModule],
  providers: [PaymentService, ConfigService, Logger],
  controllers: [PaymentController],
})
export class PaymentModule {}
