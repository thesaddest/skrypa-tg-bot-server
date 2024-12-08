import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { LavaTopService } from './lava-top.service';
import { JWT_GUARD_NAME } from '../auth/jwt.constants';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('lava-top')
export class LavaTopController {
  constructor(
    private readonly lavaTopService: LavaTopService,
    private readonly logger: Logger,
  ) {}

  @UseGuards(AuthGuard(JWT_GUARD_NAME), AdminGuard)
  @Get('products')
  async getAllProducts() {
    try {
      return await this.lavaTopService.getAllProducts();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
