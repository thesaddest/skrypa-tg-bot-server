import { IsNumber, IsString } from 'class-validator';

export class PriceDTO {
  @IsString()
  currency: string;

  @IsNumber()
  amount: number;
}
