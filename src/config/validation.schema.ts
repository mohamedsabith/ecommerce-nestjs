import * as Joi from 'joi';

export default Joi.object({
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
  ENABLE_CORS: Joi.string().default('true'),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DATABASE: Joi.string().required(),
  RUN_MIGRATIONS: Joi.boolean().default(true),
});
