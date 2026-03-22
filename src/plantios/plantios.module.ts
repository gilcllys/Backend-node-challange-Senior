import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturePlanted } from '../culture-planted/entities/culture-planted.entity';
import { Farm } from '../farms/entities/farm.entity';
import { Safra } from '../safras/entities/safra.entity';
import { Plantio } from './entities/plantio.entity';
import { PlantiosController } from './plantios.controller';
import { PlantiosService } from './plantios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plantio, Farm, Safra, CulturePlanted])],
  controllers: [PlantiosController],
  providers: [PlantiosService],
  exports: [PlantiosService],
})
export class PlantiosModule {}
