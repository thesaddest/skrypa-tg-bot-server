import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
