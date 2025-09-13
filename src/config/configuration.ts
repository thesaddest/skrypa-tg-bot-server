import * as process from 'process';

import * as Joi from 'joi';

export const Configuration = () => ({
  app: {
    name: process.env.APP_NAME,
    port: process.env.APP_PORT,
    node_env: process.env.NODE_ENV,
    log_level: process.env.LOG_LEVEL,
    client_url: process.env.CLIENT_URL,
    webhook_url: process.env.WEBHOOK_URL,
  },
  auth: {
    jwt_secret: process.env.JWT_SECRET,
  },
  db: {
    db_url: process.env.DATABASE_URL,
  },
  tg: {
    api_token: process.env.TELEGRAM_API_TOKEN,
  },
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY,
    public_key: process.env.STRIPE_PUBLIC_KEY,
    webhook_secret_key: process.env.STRIPE_WEBHOOK_SECRET_KEY,
  },
});

export const ConfigurationValidationSchema = Joi.object({
  APP_NAME: Joi.string().required(),
  APP_PORT: Joi.number().required(),
  NODE_ENV: Joi.string().required(),
  LOG_LEVEL: Joi.string().required(),
  CLIENT_URL: Joi.string().required(),
  WEBHOOK_URL: Joi.string().required(),

  DATABASE_URL: Joi.string().required(),

  TELEGRAM_API_TOKEN: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
});
