import { IsString } from 'class-validator';
import { AccessType, FileType } from '@prisma/client';

export class CreateFileDto {
  @IsString()
  awsUrl: string;

  @IsString()
  fileType: FileType;

  @IsString()
  accessType: AccessType;
}
