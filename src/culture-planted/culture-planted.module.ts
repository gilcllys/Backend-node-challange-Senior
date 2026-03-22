import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturePlantedController } from './culture-planted.controller';
import { CulturePlantedService } from './culture-planted.service';
import { CulturePlanted } from './entities/culture-planted.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CulturePlanted])],
  controllers: [CulturePlantedController],
  providers: [CulturePlantedService],
  exports: [CulturePlantedService],
})
export class CulturePlantedModule {}
