import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from '../farms/entities/farm.entity';
import { Plantio } from '../plantios/entities/plantio.entity';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(Plantio)
    private readonly plantioRepository: Repository<Plantio>,
  ) {}

  async getDashboard(): Promise<DashboardResponseDto> {
    this.logger.log('Generating dashboard data');

    const [totalFarms, totals, byState, byCulture, landUse] = await Promise.all(
      [
        this.farmRepository.count(),
        this.farmRepository
          .createQueryBuilder('farm')
          .select('COALESCE(SUM(farm.total_area), 0)', 'totalHectares')
          .getRawOne(),
        this.farmRepository
          .createQueryBuilder('farm')
          .select('farm.state', 'state')
          .addSelect('COUNT(*)::int', 'count')
          .groupBy('farm.state')
          .orderBy('count', 'DESC')
          .getRawMany(),
        this.plantioRepository
          .createQueryBuilder('plantio')
          .innerJoin('plantio.culturePlanted', 'culture')
          .select('culture.name', 'culture')
          .addSelect('COUNT(*)::int', 'count')
          .groupBy('culture.name')
          .orderBy('count', 'DESC')
          .getRawMany(),
        this.farmRepository
          .createQueryBuilder('farm')
          .select('COALESCE(SUM(farm.arable_area), 0)', 'arableArea')
          .addSelect('COALESCE(SUM(farm.vegetation_area), 0)', 'vegetationArea')
          .getRawOne(),
      ],
    );

    return {
      totalFarms,
      totalHectares: Number(totals.totalHectares),
      byState,
      byCulture,
      byLandUse: {
        arableArea: Number(landUse.arableArea),
        vegetationArea: Number(landUse.vegetationArea),
      },
    };
  }
}
