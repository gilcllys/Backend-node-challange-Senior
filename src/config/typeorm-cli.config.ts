import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'brain_ag',
  password: process.env.DB_PASSWORD || 'brain_ag_pass',
  database: process.env.DB_DATABASE || 'brain_agriculture',
  entities: ['src/**/entities/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
});
