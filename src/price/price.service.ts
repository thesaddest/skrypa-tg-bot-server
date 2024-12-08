import { Injectable } from '@nestjs/common';
import { Price } from '@prisma/client';
import { DbService } from '../db/db.service';
import { ALREADY_BOUGHT_PREFIX } from './enums/price-default-id.enum';

@Injectable()
export class PriceService {
  constructor(private readonly dbService: DbService) {}

  async getAllPrices(hasPurchasedCourses: boolean): Promise<Price[]> {
    return this.dbService.price.findMany({
      where: {
        id: hasPurchasedCourses
          ? { startsWith: ALREADY_BOUGHT_PREFIX } // Fetch prices with "already-bought" prefix
          : { not: { startsWith: ALREADY_BOUGHT_PREFIX } }, // Exclude prices with "already-bought" prefix
      },
    });
  }
}
