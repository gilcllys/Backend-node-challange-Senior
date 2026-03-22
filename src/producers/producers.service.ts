import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { Producer } from './entities/producer.entity';

@Injectable()
export class ProducersService {
  private readonly logger = new Logger(ProducersService.name);

  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async create(dto: CreateProducerDto): Promise<Producer> {
    const existing = await this.producerRepository.findOne({
      where: { cpfCnpj: dto.cpfCnpj.replace(/\D/g, '') },
    });
    if (existing) {
      throw new ConflictException('Já existe um produtor com este CPF/CNPJ');
    }

    const producer = this.producerRepository.create({
      ...dto,
      cpfCnpj: dto.cpfCnpj.replace(/\D/g, ''),
    });
    this.logger.log(`Creating producer: ${producer.name}`);
    return this.producerRepository.save(producer);
  }

  async findAll(pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const [data, total] = await this.producerRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Producer> {
    const producer = await this.producerRepository.findOne({
      where: { id },
      relations: ['farms'],
    });
    if (!producer) {
      throw new NotFoundException(`Produtor com ID ${id} não encontrado`);
    }
    return producer;
  }

  async update(id: string, dto: UpdateProducerDto): Promise<Producer> {
    const producer = await this.findOne(id);
    if (dto.cpfCnpj) {
      const cleaned = dto.cpfCnpj.replace(/\D/g, '');
      const existing = await this.producerRepository.findOne({
        where: { cpfCnpj: cleaned },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Já existe um produtor com este CPF/CNPJ');
      }
      dto.cpfCnpj = cleaned;
    }
    Object.assign(producer, dto);
    this.logger.log(`Updating producer: ${id}`);
    return this.producerRepository.save(producer);
  }

  async remove(id: string): Promise<void> {
    const producer = await this.findOne(id);
    this.logger.log(`Soft deleting producer: ${id}`);
    await this.producerRepository.softRemove(producer);
  }
}
