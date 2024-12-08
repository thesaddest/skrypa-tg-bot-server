import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreatePaymentLinkDto {
  @IsString()
  userId: string;

  @IsArray()
  @IsString({ each: true })
  courseIds: string[];

  @IsNumber()
  price: number;
}
