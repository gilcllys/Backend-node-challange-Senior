import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Producer } from '../producers/entities/producer.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from './entities/farm.entity';

@Injectable()
export class FarmsService {
  private readonly logger = new Logger(FarmsService.name);

  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async create(dto: CreateFarmDto): Promise<Farm> {
    const producer = await this.producerRepository.findOne({
      where: { id: dto.producerId },
    });
    if (!producer) {
      throw new NotFoundException(
        `Produtor com ID ${dto.producerId} não encontrado`,
      );
    }

    const farm = this.farmRepository.create(dto);
    this.logger.log(
      `Creating farm: ${farm.name} for producer ${dto.producerId}`,
    );
    return this.farmRepository.save(farm);
  }

  async findAll(pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const [data, total] = await this.farmRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['producer'],
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.farmRepository.findOne({
      where: { id },
      relations: [
        'producer',
        'plantios',
        'plantios.safra',
        'plantios.culturePlanted',
      ],
    });
    if (!farm) {
      throw new NotFoundException(`Fazenda com ID ${id} não encontrada`);
    }
    return farm;
  }

  async update(id: string, dto: UpdateFarmDto): Promise<Farm> {
    const farm = await this.findOne(id);

    if (dto.producerId && dto.producerId !== farm.producerId) {
      const producer = await this.producerRepository.findOne({
        where: { id: dto.producerId },
      });
      if (!producer) {
        throw new NotFoundException(
          `Produtor com ID ${dto.producerId} não encontrado`,
        );
      }
    }

    // Validate areas with merged values
    const totalArea = dto.totalArea ?? farm.totalArea;
    const arableArea = dto.arableArea ?? farm.arableArea;
    const vegetationArea = dto.vegetationArea ?? farm.vegetationArea;

    if (Number(arableArea) + Number(vegetationArea) > Number(totalArea)) {
      throw new BadRequestException(
        'A soma da área agricultável e vegetação não pode ultrapassar a área total da fazenda',
      );
    }

    Object.assign(farm, dto);
    this.logger.log(`Updating farm: ${id}`);
    return this.farmRepository.save(farm);
  }

  async remove(id: string): Promise<void> {
    const farm = await this.findOne(id);
    this.logger.log(`Soft deleting farm: ${id}`);
    await this.farmRepository.softRemove(farm);
  }
}
