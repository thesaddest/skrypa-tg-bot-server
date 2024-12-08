import { IsArray, IsString, IsUUID } from 'class-validator';
import { PriceDTO } from './price.dto';

export class OfferDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsArray()
  prices: PriceDTO[];
}
