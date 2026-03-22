import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import databaseConfig from './config/database.config';
import { CulturePlantedModule } from './culture-planted/culture-planted.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FarmsModule } from './farms/farms.module';
import { PlantiosModule } from './plantios/plantios.module';
import { ProducersModule } from './producers/producers.module';
import { SafrasModule } from './safras/safras.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        ...configService.get<TypeOrmModuleOptions>('database'),
      }),
    }),
    ProducersModule,
    FarmsModule,
    SafrasModule,
    CulturePlantedModule,
    PlantiosModule,
    DashboardModule,
  ],
})
export class AppModule {}
