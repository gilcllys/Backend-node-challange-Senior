import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CulturePlantedModule } from '../src/culture-planted/culture-planted.module';
import { CulturePlanted } from '../src/culture-planted/entities/culture-planted.entity';
import { DashboardModule } from '../src/dashboard/dashboard.module';
import { Farm } from '../src/farms/entities/farm.entity';
import { FarmsModule } from '../src/farms/farms.module';
import { Plantio } from '../src/plantios/entities/plantio.entity';
import { PlantiosModule } from '../src/plantios/plantios.module';
import { Producer } from '../src/producers/entities/producer.entity';
import { ProducersModule } from '../src/producers/producers.module';
import { Safra } from '../src/safras/entities/safra.entity';
import { SafrasModule } from '../src/safras/safras.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT ?? '5432', 10),
          username: process.env.DB_USERNAME || 'brain_ag',
          password: process.env.DB_PASSWORD || 'brain_ag_pass',
          database: process.env.DB_DATABASE || 'brain_agriculture',
          entities: [Producer, Farm, Safra, CulturePlanted, Plantio],
          synchronize: true,
          dropSchema: true,
        }),
        ProducersModule,
        FarmsModule,
        SafrasModule,
        CulturePlantedModule,
        PlantiosModule,
        DashboardModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let producerId: string;
  let farmId: string;
  let safraId: string;
  let cultureId: string;

  describe('Producers', () => {
    it('POST /producers — should create a producer', () => {
      return request(app.getHttpServer())
        .post('/producers')
        .send({ cpfCnpj: '36836655724', name: 'João da Silva' })
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.cpfCnpj).toBe('36836655724');
          producerId = res.body.id;
        });
    });

    it('POST /producers — should reject invalid CPF', () => {
      return request(app.getHttpServer())
        .post('/producers')
        .send({ cpfCnpj: '12345678901', name: 'Invalid' })
        .expect(400);
    });

    it('POST /producers — should reject duplicate CPF', () => {
      return request(app.getHttpServer())
        .post('/producers')
        .send({ cpfCnpj: '36836655724', name: 'Duplicate' })
        .expect(409);
    });

    it('GET /producers — should list producers', () => {
      return request(app.getHttpServer())
        .get('/producers')
        .expect(200)
        .then((res) => {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.total).toBe(1);
        });
    });

    it('GET /producers/:id — should find a producer', () => {
      return request(app.getHttpServer())
        .get(`/producers/${producerId}`)
        .expect(200)
        .then((res) => {
          expect(res.body.name).toBe('João da Silva');
        });
    });

    it('PATCH /producers/:id — should update a producer', () => {
      return request(app.getHttpServer())
        .patch(`/producers/${producerId}`)
        .send({ name: 'João Updated' })
        .expect(200)
        .then((res) => {
          expect(res.body.name).toBe('João Updated');
        });
    });
  });

  describe('Farms', () => {
    it('POST /farms — should create a farm', () => {
      return request(app.getHttpServer())
        .post('/farms')
        .send({
          name: 'Fazenda Test',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 1000,
          arableArea: 600,
          vegetationArea: 400,
          producerId,
        })
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          farmId = res.body.id;
        });
    });

    it('POST /farms — should reject area overflow', () => {
      return request(app.getHttpServer())
        .post('/farms')
        .send({
          name: 'Bad Farm',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 1000,
          arableArea: 700,
          vegetationArea: 400,
          producerId,
        })
        .expect(400);
    });

    it('GET /farms — should list farms', () => {
      return request(app.getHttpServer())
        .get('/farms')
        .expect(200)
        .then((res) => {
          expect(res.body.data).toHaveLength(1);
        });
    });

    it('PATCH /farms/:id — should reject area overflow on update', () => {
      return request(app.getHttpServer())
        .patch(`/farms/${farmId}`)
        .send({ arableArea: 800 })
        .expect(400);
    });
  });

  describe('Safras', () => {
    it('POST /safras — should create a safra', () => {
      return request(app.getHttpServer())
        .post('/safras')
        .send({ name: 'Safra 2024' })
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          safraId = res.body.id;
        });
    });
  });

  describe('Culture Planted', () => {
    it('POST /culture-planted — should create a culture', () => {
      return request(app.getHttpServer())
        .post('/culture-planted')
        .send({ name: 'Soja' })
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          cultureId = res.body.id;
        });
    });
  });

  describe('Plantios', () => {
    it('POST /plantios — should register a plantio', () => {
      return request(app.getHttpServer())
        .post('/plantios')
        .send({ farmId, safraId, culturePlantedId: cultureId })
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
        });
    });

    it('POST /plantios — should reject duplicate combination', () => {
      return request(app.getHttpServer())
        .post('/plantios')
        .send({ farmId, safraId, culturePlantedId: cultureId })
        .expect(409);
    });

    it('GET /plantios — should list plantios', () => {
      return request(app.getHttpServer())
        .get('/plantios')
        .expect(200)
        .then((res) => {
          expect(res.body.data).toHaveLength(1);
        });
    });
  });

  describe('Dashboard', () => {
    it('GET /dashboard — should return dashboard data', () => {
      return request(app.getHttpServer())
        .get('/dashboard')
        .expect(200)
        .then((res) => {
          expect(res.body.totalFarms).toBe(1);
          expect(res.body.totalHectares).toBe(1000);
          expect(res.body.byState).toHaveLength(1);
          expect(res.body.byState[0].state).toBe('SP');
          expect(res.body.byCulture).toHaveLength(1);
          expect(res.body.byCulture[0].culture).toBe('Soja');
          expect(res.body.byLandUse.arableArea).toBe(600);
          expect(res.body.byLandUse.vegetationArea).toBe(400);
        });
    });
  });

  describe('Cleanup — Delete', () => {
    it('DELETE /producers/:id — should soft delete', () => {
      return request(app.getHttpServer())
        .delete(`/producers/${producerId}`)
        .expect(204);
    });

    it('GET /producers/:id — should not find deleted producer', () => {
      return request(app.getHttpServer())
        .get(`/producers/${producerId}`)
        .expect(404);
    });
  });
});
