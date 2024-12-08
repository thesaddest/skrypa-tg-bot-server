import { Logger, Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { DbModule } from '../db/db.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DbModule, UserModule],
  providers: [CourseService, Logger],
  controllers: [CourseController],
})
export class CourseModule {}
