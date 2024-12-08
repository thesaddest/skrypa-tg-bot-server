import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  RawBodyRequest,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';
import { JWT_GUARD_NAME } from '../auth/jwt.constants';
import { Request, Response } from 'express';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly logger: Logger,
  ) {}

  @UseGuards(AuthGuard(JWT_GUARD_NAME))
  @Post('create-payment-link')
  async createPaymentLink(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createPaymentLinkDto: CreatePaymentLinkDto,
  ) {
    this.logger.debug(
      `Creating payment link for user, id: ${req.user.id}, telegramId: ${req.user.telegramId}`,
    );
    try {
      const { userId, courseIds, price } = createPaymentLinkDto;

      const paymentLink = await this.paymentService.createPaymentLink(
        userId,
        courseIds,
        price,
      );

      res.json({
        paymentLink,
        success: true,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    this.logger.debug(
      `Handling webhook with body: ${JSON.stringify(req.body)}`,
    );

    try {
      await this.paymentService.processWebhook(req);

      res.status(200).send({ success: true });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
