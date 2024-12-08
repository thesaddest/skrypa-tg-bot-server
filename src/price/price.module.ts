import { Logger, Module } from '@nestjs/common';
import { PriceController } from './price.controller';
import { ConfigService } from '../config/config.service';
import { PriceService } from './price.service';
import { DbService } from '../db/db.service';

@Module({
  controllers: [PriceController],
  providers: [ConfigService, Logger, PriceService, DbService],
})
export class PriceModule {}
