import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Course } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class CourseService {
  constructor(
    private readonly userService: UserService,
    private readonly dbService: DbService,
  ) {}

  async createCourse(data: CreateCourseDto): Promise<Course> {
    const { files, translations, ...courseData } = data;

    return this.dbService.course.create({
      data: {
        ...courseData,
        translations: {
          create: translations.map((translation) => ({
            language: translation.language,
            title: translation.title,
            description: translation.description,
            smallDescription: translation.smallDescription,
          })),
        },
        files: files?.length
          ? {
              create: files.map((file) => ({
                awsUrl: file.awsUrl,
                fileType: file.fileType,
                accessType: file.accessType,
              })),
            }
          : undefined,
      },
      include: {
        translations: true, // Include translations in the response
        files: true, // Include files in the response
      },
    });
  }

  async getUserCourses(userId: string): Promise<Course[]> {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      return [];
    }

    return this.dbService.findMany(this.dbService.course, {
      where: {
        id: {
          in: user.coursesBought.map((course) => course.id),
        },
      },
      include: { files: true, translations: true },
    });
  }

  async getAllCourses(): Promise<Course[]> {
    return this.dbService.course.findMany({
      include: {
        files: { where: { accessType: 'PUBLIC' } },
        translations: true,
      },
    });
  }
}
