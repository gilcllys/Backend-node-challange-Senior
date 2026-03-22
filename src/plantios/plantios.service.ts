import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CulturePlanted } from '../culture-planted/entities/culture-planted.entity';
import { Farm } from '../farms/entities/farm.entity';
import { Safra } from '../safras/entities/safra.entity';
import { CreatePlantioDto } from './dto/create-plantio.dto';
import { Plantio } from './entities/plantio.entity';

@Injectable()
export class PlantiosService {
  private readonly logger = new Logger(PlantiosService.name);

  constructor(
    @InjectRepository(Plantio)
    private readonly plantioRepository: Repository<Plantio>,
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(Safra)
    private readonly safraRepository: Repository<Safra>,
    @InjectRepository(CulturePlanted)
    private readonly cultureRepository: Repository<CulturePlanted>,
  ) {}

  async create(dto: CreatePlantioDto): Promise<Plantio> {
    const farm = await this.farmRepository.findOne({
      where: { id: dto.farmId },
    });
    if (!farm) {
      throw new NotFoundException(
        `Fazenda com ID ${dto.farmId} não encontrada`,
      );
    }

    const safra = await this.safraRepository.findOne({
      where: { id: dto.safraId },
    });
    if (!safra) {
      throw new NotFoundException(`Safra com ID ${dto.safraId} não encontrada`);
    }

    const culture = await this.cultureRepository.findOne({
      where: { id: dto.culturePlantedId },
    });
    if (!culture) {
      throw new NotFoundException(
        `Cultura com ID ${dto.culturePlantedId} não encontrada`,
      );
    }

    const existing = await this.plantioRepository.findOne({
      where: {
        farmId: dto.farmId,
        safraId: dto.safraId,
        culturePlantedId: dto.culturePlantedId,
      },
    });
    if (existing) {
      throw new ConflictException(
        'Esta combinação de fazenda, safra e cultura já está registrada',
      );
    }

    const plantio = this.plantioRepository.create(dto);
    this.logger.log(
      `Creating plantio: farm=${dto.farmId}, safra=${dto.safraId}, culture=${dto.culturePlantedId}`,
    );
    return this.plantioRepository.save(plantio);
  }

  async findAll(pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const [data, total] = await this.plantioRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['farm', 'safra', 'culturePlanted'],
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Plantio> {
    const plantio = await this.plantioRepository.findOne({
      where: { id },
      relations: ['farm', 'safra', 'culturePlanted'],
    });
    if (!plantio) {
      throw new NotFoundException(`Plantio com ID ${id} não encontrado`);
    }
    return plantio;
  }

  async remove(id: string): Promise<void> {
    const plantio = await this.findOne(id);
    this.logger.log(`Deleting plantio: ${id}`);
    await this.plantioRepository.remove(plantio);
  }
}
