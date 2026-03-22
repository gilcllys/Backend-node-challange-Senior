import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateCulturePlantedDto } from './dto/create-culture-planted.dto';
import { UpdateCulturePlantedDto } from './dto/update-culture-planted.dto';
import { CulturePlanted } from './entities/culture-planted.entity';

@Injectable()
export class CulturePlantedService {
  private readonly logger = new Logger(CulturePlantedService.name);

  constructor(
    @InjectRepository(CulturePlanted)
    private readonly cultureRepository: Repository<CulturePlanted>,
  ) {}

  async create(dto: CreateCulturePlantedDto): Promise<CulturePlanted> {
    const existing = await this.cultureRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Cultura "${dto.name}" já existe`);
    }
    const culture = this.cultureRepository.create(dto);
    this.logger.log(`Creating culture: ${culture.name}`);
    return this.cultureRepository.save(culture);
  }

  async findAll(pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const [data, total] = await this.cultureRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<CulturePlanted> {
    const culture = await this.cultureRepository.findOne({ where: { id } });
    if (!culture) {
      throw new NotFoundException(`Cultura com ID ${id} não encontrada`);
    }
    return culture;
  }

  async update(
    id: string,
    dto: UpdateCulturePlantedDto,
  ): Promise<CulturePlanted> {
    const culture = await this.findOne(id);
    if (dto.name && dto.name !== culture.name) {
      const existing = await this.cultureRepository.findOne({
        where: { name: dto.name },
      });
      if (existing) {
        throw new ConflictException(`Cultura "${dto.name}" já existe`);
      }
    }
    Object.assign(culture, dto);
    this.logger.log(`Updating culture: ${id}`);
    return this.cultureRepository.save(culture);
  }

  async remove(id: string): Promise<void> {
    const culture = await this.findOne(id);
    this.logger.log(`Deleting culture: ${id}`);
    await this.cultureRepository.remove(culture);
  }
}
