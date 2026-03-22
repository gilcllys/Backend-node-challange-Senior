import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { CulturePlanted } from '../../culture-planted/entities/culture-planted.entity';
import { Farm } from '../../farms/entities/farm.entity';
import { Safra } from '../../safras/entities/safra.entity';

@Entity('plantios')
@Unique(['farmId', 'safraId', 'culturePlantedId'])
export class Plantio extends BaseEntity {
  @Column({ name: 'farm_id' })
  farmId: string;

  @Column({ name: 'safra_id' })
  safraId: string;

  @Column({ name: 'culture_planted_id' })
  culturePlantedId: string;

  @ManyToOne(() => Farm, (farm) => farm.plantios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @ManyToOne(() => Safra, (safra) => safra.plantios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'safra_id' })
  safra: Safra;

  @ManyToOne(() => CulturePlanted, (culture) => culture.plantios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'culture_planted_id' })
  culturePlanted: CulturePlanted;
}
