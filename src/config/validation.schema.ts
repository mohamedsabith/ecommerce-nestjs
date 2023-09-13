import * as Joi from 'joi';

export default Joi.object({
  PORT: Joi.number().default(3000),
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  ENABLE_CORS: Joi.string().default('true'),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  RUN_MIGRATIONS: Joi.boolean().default(true),
  DB_TYPE: Joi.string().required(),
  TWILIO_ACCOUNT_SID: Joi.string().required(),
  TWILIO_AUTH_TOKEN: Joi.string().required(),
  TWILIO_PHONE_NUMBER: Joi.number().required(),
  SWAGGER_USER: Joi.string().required(),
  SWAGGER_PASSWORD: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  JWT_FORGOT_PASSWORD_TOKEN_EXPIRATION_TIME: Joi.string().required(),
});
