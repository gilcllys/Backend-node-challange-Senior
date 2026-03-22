import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('database', () => ({
  type: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'brain_ag',
  password: process.env.DB_PASSWORD || 'brain_ag_pass',
  database: process.env.DB_DATABASE || 'brain_agriculture',
  autoLoadEntities: true,
  synchronize: false,
  migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
  migrationsRun: true,
}));
