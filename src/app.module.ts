import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { TelegramModule } from './telegram/telegram.module';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { AxiosService } from './common/axios/axios.service';
import { AxiosModule } from './common/axios/axios.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { PriceModule } from './price/price.module';
import { PaymentModule } from './payment/payment.module';
import { EventModule } from './event/event.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule,
    TelegramModule,
    DbModule,
    UserModule,
    AxiosModule,
    AuthModule,
    CourseModule,
    PriceModule,
    PaymentModule,
    EventModule,
    NotificationModule,
  ],
  providers: [AxiosService, Logger],
  controllers: [],
})
export class AppModule {}
