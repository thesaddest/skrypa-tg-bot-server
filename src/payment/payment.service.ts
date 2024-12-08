import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  RawBodyRequest,
} from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '../config/config.service';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { EventService } from '../event/event.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly userService: UserService,
    private readonly eventService: EventService,
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('stripe.secret_key'),
    );
  }

  async createPaymentLink(
    userId: string,
    courseIds: string[],
    price: number,
  ): Promise<string> {
    this.logger.debug(
      `Creating payment link for userId: ${userId}, price: ${price}`,
    );

    try {
      const prices = await this.getAllPrices();
      const matchedPrice = prices.find((p) => p.unit_amount === price * 100);

      if (!matchedPrice) {
        this.logger.warn(`Price ${price} not found for userId: ${userId}`);
        throw new BadRequestException('Invalid price');
      }

      const paymentLink = await this.stripe.paymentLinks.create({
        line_items: [
          {
            price: matchedPrice.id,
            quantity: 1,
          },
        ],
        metadata: {
          user_id: userId,
          course_ids: courseIds.join(','),
        },
      });

      this.logger.debug(`Payment link created for userId: ${userId}`);
      return paymentLink.url;
    } catch (error) {
      this.logger.error(
        `Error creating payment link for userId: ${userId}`,
        error,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create payment link');
    }
  }

  async processWebhook(req: RawBodyRequest<Request>) {
    const endpointSecret = this.configService.get<string>(
      'stripe.webhook_secret_key',
    );

    if (!endpointSecret) {
      throw new InternalServerErrorException(
        'Webhook secret key is not defined',
      );
    }

    const sig = req.headers['stripe-signature'];
    if (!sig) {
      throw new BadRequestException('Stripe signature is missing');
    }
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        endpointSecret,
      );
    } catch (err) {
      this.logger.error(`Webhook Event Error: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Save the event to the database
    try {
      await this.eventService.saveStripeEvent(event);
      this.logger.debug(`Event ${event.id} saved successfully`);
    } catch (err) {
      this.logger.error(`Failed to save Stripe event: ${err.message}`);
      throw new InternalServerErrorException('Failed to save event');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (
          !session.metadata ||
          !session.metadata.user_id ||
          !session.metadata.course_ids
        ) {
          this.logger.error('Missing required metadata in session object');
          throw new BadRequestException('Invalid session metadata');
        }

        // Retrieve metadata
        const userId = session.metadata.user_id;
        const courseIds = session.metadata.course_ids.split(',');

        this.logger.debug(
          `Checkout session: ${session.id} completed for userId: ${userId} with courseIds: ${courseIds}`,
        );

        // Update user's purchased courses
        try {
          await this.userService.updateUserCourses(userId, courseIds);

          this.logger.debug(
            `Courses successfully updated for userId: ${userId}`,
          );

          await this.notificationService.createNotification(
            userId,
            'Your payment was successful! Courses have been added to your account.',
            'PAYMENT_SUCCESSFUL',
          );
        } catch (error) {
          this.logger.error(
            `Failed to update courses for userId: ${userId}. Error: ${error.message}`,
          );

          throw new InternalServerErrorException(
            'Failed to update user courses after payment',
          );
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata?.user_id;

        this.logger.error(`Payment failed: ${paymentIntent.id}`);

        if (userId) {
          await this.notificationService.createNotification(
            userId,
            'Your payment failed. Please try again or contact support.',
            'PAYMENT_FAILED',
          );
        }

        break;
      }
      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
    }

    // Mark the event as processed after handling
    try {
      await this.eventService.markEventProcessed(event.id);
    } catch (err) {
      this.logger.error(
        `Failed to mark event ${event.id} as processed: ${err.message}`,
      );
    }
  }

  private async getAllPrices(): Promise<Stripe.Price[]> {
    const prices = await this.stripe.prices.list();
    return prices.data;
  }
}
