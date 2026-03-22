import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Producer } from './entities/producer.entity';
import { ProducersService } from './producers.service';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  softRemove: jest.fn(),
});

describe('ProducersService', () => {
  let service: ProducersService;
  let repository: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        { provide: getRepositoryToken(Producer), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
    repository = module.get(getRepositoryToken(Producer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a producer with valid CPF', async () => {
      const dto = { cpfCnpj: '368.366.557-24', name: 'João da Silva' };
      const producer = {
        id: 'uuid-1',
        cpfCnpj: '36836655724',
        name: 'João da Silva',
      };

      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(producer);
      repository.save.mockResolvedValue(producer);

      const result = await service.create(dto);
      expect(result).toEqual(producer);
      expect(repository.create).toHaveBeenCalledWith({
        cpfCnpj: '36836655724',
        name: 'João da Silva',
      });
    });

    it('should throw ConflictException if CPF/CNPJ already exists', async () => {
      const dto = { cpfCnpj: '368.366.557-24', name: 'João da Silva' };
      repository.findOne.mockResolvedValue({ id: 'existing' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const producers = [{ id: 'uuid-1', name: 'Test' }];
      repository.findAndCount.mockResolvedValue([producers, 1]);

      const result = await service.findAll({ page: 1, limit: 20 });
      expect(result).toEqual({ data: producers, total: 1, page: 1, limit: 20 });
    });
  });

  describe('findOne', () => {
    it('should return a producer by id', async () => {
      const producer = { id: 'uuid-1', name: 'Test' };
      repository.findOne.mockResolvedValue(producer);

      const result = await service.findOne('uuid-1');
      expect(result).toEqual(producer);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findOne('uuid-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a producer', async () => {
      const existing = { id: 'uuid-1', cpfCnpj: '36836655724', name: 'João' };
      repository.findOne.mockResolvedValue(existing);
      repository.save.mockResolvedValue({ ...existing, name: 'João Updated' });

      const result = await service.update('uuid-1', { name: 'João Updated' });
      expect(result.name).toBe('João Updated');
    });

    it('should throw ConflictException if updating to existing CPF/CNPJ', async () => {
      const existing = { id: 'uuid-1', cpfCnpj: '36836655724', name: 'João' };
      const other = { id: 'uuid-2', cpfCnpj: '71058643380' };

      repository.findOne
        .mockResolvedValueOnce(existing) // findOne for the producer being updated
        .mockResolvedValueOnce(other); // findOne for CPF check

      await expect(
        service.update('uuid-1', { cpfCnpj: '710.586.433-80' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should soft delete a producer', async () => {
      const producer = { id: 'uuid-1', name: 'Test' };
      repository.findOne.mockResolvedValue(producer);
      repository.softRemove.mockResolvedValue(producer);

      await service.remove('uuid-1');
      expect(repository.softRemove).toHaveBeenCalledWith(producer);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.remove('uuid-1')).rejects.toThrow(NotFoundException);
    });
  });
});
