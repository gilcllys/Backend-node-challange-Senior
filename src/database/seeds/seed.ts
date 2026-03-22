import { DataSource } from 'typeorm';
import { CulturePlanted } from '../../culture-planted/entities/culture-planted.entity';
import { Farm } from '../../farms/entities/farm.entity';
import { Plantio } from '../../plantios/entities/plantio.entity';
import { Producer } from '../../producers/entities/producer.entity';
import { Safra } from '../../safras/entities/safra.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME || 'brain_ag',
    password: process.env.DB_PASSWORD || 'brain_ag_pass',
    database: process.env.DB_DATABASE || 'brain_agriculture',
    entities: [Producer, Farm, Safra, CulturePlanted, Plantio],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('Database connected. Seeding...');

  const producerRepo = dataSource.getRepository(Producer);
  const farmRepo = dataSource.getRepository(Farm);
  const safraRepo = dataSource.getRepository(Safra);
  const cultureRepo = dataSource.getRepository(CulturePlanted);
  const plantioRepo = dataSource.getRepository(Plantio);

  // Clean existing data
  await plantioRepo.delete({});
  await farmRepo.delete({});
  await producerRepo.delete({});
  await safraRepo.delete({});
  await cultureRepo.delete({});

  // Producers
  const producers = await producerRepo.save([
    { cpfCnpj: '36836655724', name: 'João da Silva' },
    { cpfCnpj: '11144477735', name: 'Maria Oliveira' },
    { cpfCnpj: '11222333000181', name: 'Agropecuária Sol Nascente LTDA' },
  ]);
  console.log(`Created ${producers.length} producers`);

  // Farms
  const farms = await farmRepo.save([
    {
      name: 'Fazenda Santa Maria',
      city: 'Ribeirão Preto',
      state: 'SP',
      totalArea: 1500,
      arableArea: 900,
      vegetationArea: 600,
      producerId: producers[0].id,
    },
    {
      name: 'Fazenda Boa Vista',
      city: 'Uberlândia',
      state: 'MG',
      totalArea: 2000,
      arableArea: 1200,
      vegetationArea: 800,
      producerId: producers[0].id,
    },
    {
      name: 'Fazenda Esperança',
      city: 'Londrina',
      state: 'PR',
      totalArea: 800,
      arableArea: 500,
      vegetationArea: 300,
      producerId: producers[1].id,
    },
    {
      name: 'Fazenda Sol Nascente',
      city: 'Sorriso',
      state: 'MT',
      totalArea: 5000,
      arableArea: 3500,
      vegetationArea: 1500,
      producerId: producers[2].id,
    },
    {
      name: 'Fazenda Rio Bonito',
      city: 'Luís Eduardo Magalhães',
      state: 'BA',
      totalArea: 3000,
      arableArea: 2000,
      vegetationArea: 1000,
      producerId: producers[2].id,
    },
  ]);
  console.log(`Created ${farms.length} farms`);

  // Safras
  const safras = await safraRepo.save([
    { name: 'Safra 2021' },
    { name: 'Safra 2022' },
    { name: 'Safra 2023' },
    { name: 'Safra 2024' },
  ]);
  console.log(`Created ${safras.length} safras`);

  // Cultures
  const cultures = await cultureRepo.save([
    { name: 'Soja' },
    { name: 'Milho' },
    { name: 'Café' },
    { name: 'Algodão' },
    { name: 'Cana de Açúcar' },
  ]);
  console.log(`Created ${cultures.length} cultures`);

  // Plantios
  const plantios = await plantioRepo.save([
    {
      farmId: farms[0].id,
      safraId: safras[0].id,
      culturePlantedId: cultures[0].id,
    },
    {
      farmId: farms[0].id,
      safraId: safras[0].id,
      culturePlantedId: cultures[1].id,
    },
    {
      farmId: farms[0].id,
      safraId: safras[1].id,
      culturePlantedId: cultures[0].id,
    },
    {
      farmId: farms[1].id,
      safraId: safras[1].id,
      culturePlantedId: cultures[2].id,
    },
    {
      farmId: farms[1].id,
      safraId: safras[2].id,
      culturePlantedId: cultures[0].id,
    },
    {
      farmId: farms[2].id,
      safraId: safras[0].id,
      culturePlantedId: cultures[1].id,
    },
    {
      farmId: farms[2].id,
      safraId: safras[1].id,
      culturePlantedId: cultures[0].id,
    },
    {
      farmId: farms[3].id,
      safraId: safras[2].id,
      culturePlantedId: cultures[0].id,
    },
    {
      farmId: farms[3].id,
      safraId: safras[2].id,
      culturePlantedId: cultures[3].id,
    },
    {
      farmId: farms[3].id,
      safraId: safras[3].id,
      culturePlantedId: cultures[0].id,
    },
    {
      farmId: farms[4].id,
      safraId: safras[2].id,
      culturePlantedId: cultures[4].id,
    },
    {
      farmId: farms[4].id,
      safraId: safras[3].id,
      culturePlantedId: cultures[0].id,
    },
    {
      farmId: farms[4].id,
      safraId: safras[3].id,
      culturePlantedId: cultures[3].id,
    },
  ]);
  console.log(`Created ${plantios.length} plantios`);

  console.log('Seed completed successfully!');
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
