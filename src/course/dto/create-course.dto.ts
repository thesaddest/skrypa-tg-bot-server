import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFileDto } from '../../file/dto/create-file.dto';
import { Language } from '@prisma/client';

class CourseTranslationDto {
  @IsString()
  language: Language;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  smallDescription?: string;
}

export class CreateCourseDto {
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CourseTranslationDto)
  translations: CourseTranslationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFileDto)
  files?: CreateFileDto[];
}
