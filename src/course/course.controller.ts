import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { JWT_GUARD_NAME } from '../auth/jwt.constants';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Request } from 'express';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly logger: Logger,
  ) {}

  @UseGuards(AuthGuard(JWT_GUARD_NAME))
  @Get()
  async getAllCourses(@Req() req: Request): Promise<Course[]> {
    this.logger.debug(
      `Getting all courses for user, id: ${req.user.id}, telegramId: ${req.user.telegramId}`,
    );
    try {
      return this.courseService.getAllCourses();
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @UseGuards(AuthGuard(JWT_GUARD_NAME))
  @Get('me')
  async getAllUserCourses(@Req() req: Request): Promise<Course[]> {
    this.logger.debug(
      `Getting all courses for user, id: ${req.user.id}, telegramId: ${req.user.telegramId}`,
    );
    try {
      return this.courseService.getUserCourses(req.user.id);
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @UseGuards(AuthGuard(JWT_GUARD_NAME), AdminGuard)
  @Post()
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<Course> {
    try {
      return await this.courseService.createCourse(createCourseDto);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException(
          'Course with the same externalId already exists',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
