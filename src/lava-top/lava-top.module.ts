import { Logger, Module } from '@nestjs/common';
import { LavaTopService } from './lava-top.service';
import { LavaTopController } from './lava-top.controller';
import { ConfigService } from '../config/config.service';
import { AxiosModule } from '../common/axios/axios.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AxiosModule, AuthModule],
  providers: [LavaTopService, ConfigService, Logger],
  controllers: [LavaTopController],
})
export class LavaTopModule {}
