import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Producer } from '../producers/entities/producer.entity';
import { Farm } from './entities/farm.entity';
import { FarmsService } from './farms.service';

const mockFarmRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  softRemove: jest.fn(),
});

const mockProducerRepo = () => ({
  findOne: jest.fn(),
});

describe('FarmsService', () => {
  let service: FarmsService;
  let farmRepo: ReturnType<typeof mockFarmRepo>;
  let producerRepo: ReturnType<typeof mockProducerRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmsService,
        { provide: getRepositoryToken(Farm), useFactory: mockFarmRepo },
        { provide: getRepositoryToken(Producer), useFactory: mockProducerRepo },
      ],
    }).compile();

    service = module.get<FarmsService>(FarmsService);
    farmRepo = module.get(getRepositoryToken(Farm));
    producerRepo = module.get(getRepositoryToken(Producer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      name: 'Fazenda Test',
      city: 'São Paulo',
      state: 'SP',
      totalArea: 1000,
      arableArea: 600,
      vegetationArea: 400,
      producerId: 'uuid-1',
    };

    it('should create a farm with valid data', async () => {
      const farm = { id: 'farm-1', ...dto };
      producerRepo.findOne.mockResolvedValue({ id: 'uuid-1' });
      farmRepo.create.mockReturnValue(farm);
      farmRepo.save.mockResolvedValue(farm);

      const result = await service.create(dto);
      expect(result).toEqual(farm);
    });

    it('should throw NotFoundException if producer not found', async () => {
      producerRepo.findOne.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw BadRequestException when areas exceed total', async () => {
      const existing = {
        id: 'farm-1',
        totalArea: 1000,
        arableArea: 600,
        vegetationArea: 400,
        producerId: 'uuid-1',
      };
      farmRepo.findOne.mockResolvedValue(existing);

      await expect(
        service.update('farm-1', { arableArea: 800 }), // 800 + 400 > 1000
      ).rejects.toThrow(BadRequestException);
    });

    it('should update a farm with valid data', async () => {
      const existing = {
        id: 'farm-1',
        name: 'Old Name',
        totalArea: 1000,
        arableArea: 600,
        vegetationArea: 400,
        producerId: 'uuid-1',
      };
      farmRepo.findOne.mockResolvedValue(existing);
      farmRepo.save.mockResolvedValue({ ...existing, name: 'New Name' });

      const result = await service.update('farm-1', { name: 'New Name' });
      expect(result.name).toBe('New Name');
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const farms = [{ id: 'farm-1', name: 'Test' }];
      farmRepo.findAndCount.mockResolvedValue([farms, 1]);

      const result = await service.findAll({ page: 1, limit: 20 });
      expect(result).toEqual({ data: farms, total: 1, page: 1, limit: 20 });
    });
  });

  describe('remove', () => {
    it('should soft delete a farm', async () => {
      const farm = { id: 'farm-1', name: 'Test' };
      farmRepo.findOne.mockResolvedValue(farm);
      farmRepo.softRemove.mockResolvedValue(farm);

      await service.remove('farm-1');
      expect(farmRepo.softRemove).toHaveBeenCalledWith(farm);
    });
  });
});
