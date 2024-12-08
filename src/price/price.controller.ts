import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_GUARD_NAME } from '../auth/jwt.constants';
import { Request } from 'express';
import { PriceService } from './price.service';
import { Price } from '@prisma/client';

@Controller('price')
export class PriceController {
  constructor(
    private readonly priceService: PriceService,
    private readonly logger: Logger,
  ) {}

  @UseGuards(AuthGuard(JWT_GUARD_NAME))
  @Get()
  async getAllPrices(@Req() req: Request): Promise<Price[]> {
    this.logger.debug(
      `Getting all prices for user, id: ${req.user.id}, telegramId: ${req.user.telegramId}`,
    );

    try {
      return this.priceService.getAllPrices(req.user.hasPurchasedCourses);
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
