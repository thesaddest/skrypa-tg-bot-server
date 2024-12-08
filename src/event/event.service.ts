import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import Stripe from 'stripe';

@Injectable()
export class EventService {
  constructor(private readonly dbService: DbService) {}

  async saveStripeEvent(event: Stripe.Event) {
    try {
      await this.dbService.stripeEvent.create({
        data: {
          stripeId: event.id,
          type: event.type,
          data: JSON.stringify(event),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to save stripe event');
    }
  }

  async markEventProcessed(stripeId: string) {
    try {
      return await this.dbService.stripeEvent.update({
        where: { stripeId },
        data: { processed: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to mark Stripe event as processed: ${error.message}`,
      );
    }
  }
}
