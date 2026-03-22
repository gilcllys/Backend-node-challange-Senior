import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateSafraDto } from './dto/create-safra.dto';
import { UpdateSafraDto } from './dto/update-safra.dto';
import { Safra } from './entities/safra.entity';

@Injectable()
export class SafrasService {
  private readonly logger = new Logger(SafrasService.name);

  constructor(
    @InjectRepository(Safra)
    private readonly safraRepository: Repository<Safra>,
  ) {}

  async create(dto: CreateSafraDto): Promise<Safra> {
    const existing = await this.safraRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Safra "${dto.name}" já existe`);
    }
    const safra = this.safraRepository.create(dto);
    this.logger.log(`Creating safra: ${safra.name}`);
    return this.safraRepository.save(safra);
  }

  async findAll(pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const [data, total] = await this.safraRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Safra> {
    const safra = await this.safraRepository.findOne({ where: { id } });
    if (!safra) {
      throw new NotFoundException(`Safra com ID ${id} não encontrada`);
    }
    return safra;
  }

  async update(id: string, dto: UpdateSafraDto): Promise<Safra> {
    const safra = await this.findOne(id);
    if (dto.name && dto.name !== safra.name) {
      const existing = await this.safraRepository.findOne({
        where: { name: dto.name },
      });
      if (existing) {
        throw new ConflictException(`Safra "${dto.name}" já existe`);
      }
    }
    Object.assign(safra, dto);
    this.logger.log(`Updating safra: ${id}`);
    return this.safraRepository.save(safra);
  }

  async remove(id: string): Promise<void> {
    const safra = await this.findOne(id);
    this.logger.log(`Deleting safra: ${id}`);
    await this.safraRepository.remove(safra);
  }
}
