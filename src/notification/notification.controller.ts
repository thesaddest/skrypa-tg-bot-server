import {
  Controller,
  HttpException,
  HttpStatus,
  Get,
  Req,
  Res,
  UseGuards,
  Post,
  Body,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_GUARD_NAME } from '../auth/jwt.constants';
import { Request, Response } from 'express';
import { NotificationService } from './notification.service';
import { GetByIdDto } from './dto/get-by-id.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthGuard(JWT_GUARD_NAME))
  @Get('me')
  async getNotificationsByUserId(@Req() req: Request, @Res() res: Response) {
    try {
      const notifications =
        await this.notificationService.getNotificationsByUserId(req.user.id);

      res.json({
        notifications,
        success: true,
      });
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @UseGuards(AuthGuard(JWT_GUARD_NAME))
  @Post('mark-as-read')
  async markNotificationAsRead(
    @Req() req: Request,
    @Res() res: Response,
    @Body() getByIdDto: GetByIdDto,
  ) {
    try {
      const notification = await this.notificationService.getNotificationById(
        getByIdDto.notificationId,
      );

      if (notification.userId !== req.user.id) {
        throw new ForbiddenException(
          'You are not allowed to mark this notification as read',
        );
      }

      await this.notificationService.markAsRead(getByIdDto.notificationId);

      res.json({
        success: true,
      });
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
