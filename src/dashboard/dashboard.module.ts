import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farm } from '../farms/entities/farm.entity';
import { Plantio } from '../plantios/entities/plantio.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Farm, Plantio])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
