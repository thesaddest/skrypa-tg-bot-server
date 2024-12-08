import { IsString } from 'class-validator';

export class GetByIdDto {
  @IsString()
  notificationId: string;
}
