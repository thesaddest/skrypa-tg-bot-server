// prisma/seed.ts

import { Currency, PrismaClient } from '@prisma/client';
import {
  ALREADY_BOUGHT_PREFIX,
  DISCOUNT_ITERATIONS,
  PriceDefaultId,
} from '../src/price/enums/price-default-id.enum'; // Ensure this path is correct

const prisma = new PrismaClient();

// Base prices for each currency
const basePrices: { [key in Currency]: number } = {
  USD: 49.99,
  EUR: 45.52,
  RUB: 4779.38,
};

// Define multiple-purchase discounts
const multiplePurchaseDiscounts = [
  { key: 'FIRST', discount: parseFloat(DISCOUNT_ITERATIONS.FIRST) },
  { key: 'SECOND', discount: parseFloat(DISCOUNT_ITERATIONS.SECOND) },
  { key: 'THIRD', discount: parseFloat(DISCOUNT_ITERATIONS.THIRD) },
  { key: 'FOURTH', discount: parseFloat(DISCOUNT_ITERATIONS.FOURTH) },
  { key: 'FIFTH', discount: parseFloat(DISCOUNT_ITERATIONS.FIFTH) },
  { key: 'SIXTH', discount: parseFloat(DISCOUNT_ITERATIONS.SIXTH) },
];

// Define already-bought discounts
const alreadyBoughtDiscounts = [
  { key: 'FIRST', discount: parseFloat(DISCOUNT_ITERATIONS.FIRST) },
  { key: 'SECOND', discount: parseFloat(DISCOUNT_ITERATIONS.SECOND) },
  { key: 'THIRD', discount: parseFloat(DISCOUNT_ITERATIONS.THIRD) },
  { key: 'FOURTH', discount: parseFloat(DISCOUNT_ITERATIONS.FOURTH) },
  { key: 'FIFTH', discount: parseFloat(DISCOUNT_ITERATIONS.FIFTH) },
];

// Helper function to calculate discounted amount
const calculateDiscountedAmount = (
  base: number,
  discountPercent: number,
): number => {
  return parseFloat((base * (1 - discountPercent / 100)).toFixed(2));
};

async function main() {
  // Upsert default prices
  const usdPrice = await prisma.price.upsert({
    where: { id: PriceDefaultId.DEFAULT_USD },
    update: {}, // Do nothing if it already exists
    create: {
      id: PriceDefaultId.DEFAULT_USD, // Static ID so it can be referenced later
      currency: Currency.USD,
      amount: basePrices.USD,
    },
  });

  const eurPrice = await prisma.price.upsert({
    where: { id: PriceDefaultId.DEFAULT_EUR },
    update: {},
    create: {
      id: PriceDefaultId.DEFAULT_EUR,
      currency: Currency.EUR,
      amount: basePrices.EUR,
    },
  });

  const rubPrice = await prisma.price.upsert({
    where: { id: PriceDefaultId.DEFAULT_RUB },
    update: {},
    create: {
      id: PriceDefaultId.DEFAULT_RUB,
      currency: Currency.RUB,
      amount: basePrices.RUB,
    },
  });

  console.debug('Default Prices seeded:', { usdPrice, eurPrice, rubPrice });

  // Function to generate Price IDs
  const generatePriceId = (
    prefix: string | null,
    discountValue: string,
    currency: Currency,
  ): string => {
    return prefix
      ? `${prefix}${discountValue}-${currency.toLowerCase()}-price`
      : `${discountValue}-${currency.toLowerCase()}-price`;
  };

  // Upsert multiple-purchase discount prices
  for (const discount of multiplePurchaseDiscounts) {
    for (const currency of Object.values(Currency)) {
      const baseAmount = basePrices[currency];
      const discountedAmount = calculateDiscountedAmount(
        baseAmount,
        discount.discount,
      );
      const priceId = generatePriceId(
        null,
        discount.discount.toString(),
        currency,
      );

      await prisma.price.upsert({
        where: { id: priceId },
        update: {},
        create: {
          id: priceId,
          currency: currency,
          amount: discountedAmount,
        },
      });

      console.debug(
        `Seeded multiple-purchase discount: ${priceId} - ${discountedAmount}`,
      );
    }
  }

  // Upsert already-bought discount prices
  for (const discount of alreadyBoughtDiscounts) {
    for (const currency of Object.values(Currency)) {
      const baseAmount = basePrices[currency];
      const discountedAmount = calculateDiscountedAmount(
        baseAmount,
        discount.discount,
      );
      const priceId = generatePriceId(
        ALREADY_BOUGHT_PREFIX,
        discount.discount.toString(),
        currency,
      );

      await prisma.price.upsert({
        where: { id: priceId },
        update: {},
        create: {
          id: priceId,
          currency: currency,
          amount: discountedAmount,
        },
      });

      console.debug(
        `Seeded already-bought discount: ${priceId} - ${discountedAmount}`,
      );
    }
  }

  console.debug('All Prices seeded successfully.');
}

main()
  .then(() => {
    console.debug('Seeding completed.');
  })
  .catch((e) => {
    console.error('Seeding failed: ', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
