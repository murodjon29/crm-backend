import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();

export type ConfigType = {
  API_PORT: number;
  NODE_ENV: string;
  DB_URL: string;
  ACCESS_TOKEN_KEY: string;
  ACCESS_TOKEN_TIME: string;
  REFRESH_TOKEN_KEY: string;
  REFRESH_TOKEN_TIME: string;
  BASE_API: string;
  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_USER: string;
  MAIL_PASS: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
};

const requiredVariables = [
  'API_PORT',
  'NODE_ENV',
  'DEV_DB_URL',
  'PROD_DB_URL',
  'ACCESS_TOKEN_KEY',
  'ACCESS_TOKEN_TIME',
  'REFRESH_TOKEN_KEY',
  'REFRESH_TOKEN_TIME',
  'BASE_API',
  'MAIL_HOST',
  'MAIL_PORT',
  'MAIL_USER',
  'MAIL_PASS',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET'
];

const missingVariables = requiredVariables.filter((variable) => {
  const value = process.env[variable];
  return !value || value.trim() === '';
});

if (missingVariables.length > 0) {
  Logger.error(
    `Missing or empty required environment variables: ${missingVariables.join(', ')}`,
  );
  process.exit(1);
}

export const config: ConfigType = {
  API_PORT: parseInt(process.env.API_PORT as string, 10),
  NODE_ENV: process.env.NODE_ENV as string,
  DB_URL:
    process.env.NODE_ENV === 'dev'
      ? (process.env.DEV_DB_URL as string)
      : (process.env.PROD_DB_URL as string),
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY as string,
  ACCESS_TOKEN_TIME: process.env.ACCESS_TOKEN_TIME as string,
  REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY as string,
  REFRESH_TOKEN_TIME: process.env.REFRESH_TOKEN_TIME as string,
  BASE_API: process.env.BASE_API as string,
  MAIL_HOST: process.env.MAIL_HOST as string,
  MAIL_PORT: process.env.MAIL_PORT as string,
  MAIL_USER: process.env.MAIL_USER as string,
  MAIL_PASS: process.env.MAIL_PASS as string,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID as string,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET as string,
};
