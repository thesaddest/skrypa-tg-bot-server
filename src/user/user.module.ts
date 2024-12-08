import { Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [UserService, Logger],
  exports: [UserService],
})
export class UserModule {}
