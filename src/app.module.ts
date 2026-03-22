import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
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
