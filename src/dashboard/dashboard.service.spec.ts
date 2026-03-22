import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Farm } from '../farms/entities/farm.entity';
import { Plantio } from '../plantios/entities/plantio.entity';
import { DashboardService } from './dashboard.service';

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  getRawOne: jest.fn(),
  getRawMany: jest.fn(),
};

const mockFarmRepo = () => ({
  count: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
});

const mockPlantioRepo = () => ({
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
});

describe('DashboardService', () => {
  let service: DashboardService;
  let farmRepo: ReturnType<typeof mockFarmRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getRepositoryToken(Farm), useFactory: mockFarmRepo },
        { provide: getRepositoryToken(Plantio), useFactory: mockPlantioRepo },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    farmRepo = module.get(getRepositoryToken(Farm));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboard', () => {
    it('should return dashboard data', async () => {
      farmRepo.count.mockResolvedValue(5);
      mockQueryBuilder.getRawOne
        .mockResolvedValueOnce({ totalHectares: '12300' }) // totals
        .mockResolvedValueOnce({ arableArea: '8100', vegetationArea: '4200' }); // landUse
      mockQueryBuilder.getRawMany
        .mockResolvedValueOnce([
          { state: 'SP', count: 2 },
          { state: 'MG', count: 1 },
        ]) // byState
        .mockResolvedValueOnce([
          { culture: 'Soja', count: 5 },
          { culture: 'Milho', count: 3 },
        ]); // byCulture

      const result = await service.getDashboard();

      expect(result.totalFarms).toBe(5);
      expect(result.totalHectares).toBe(12300);
      expect(result.byState).toHaveLength(2);
      expect(result.byCulture).toHaveLength(2);
      expect(result.byLandUse.arableArea).toBe(8100);
      expect(result.byLandUse.vegetationArea).toBe(4200);
    });
  });
});
