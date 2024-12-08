import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { OfferDTO } from './offer.dto';
import { ProductType } from '../lava-top.enums';

export class ProductDTO {
  @IsUUID()
  id: string;

  @IsString()
  title: string;

  @IsEnum(ProductType)
  type: ProductType;

  @IsOptional()
  @IsArray()
  settings: string[];

  @IsArray()
  offers: OfferDTO[];
}
