import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Plantio } from '../../plantios/entities/plantio.entity';
import { Producer } from '../../producers/entities/producer.entity';

@Entity('farms')
export class Farm extends BaseEntity {
  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ name: 'total_area', type: 'decimal', precision: 10, scale: 2 })
  totalArea: number;

  @Column({ name: 'arable_area', type: 'decimal', precision: 10, scale: 2 })
  arableArea: number;

  @Column({ name: 'vegetation_area', type: 'decimal', precision: 10, scale: 2 })
  vegetationArea: number;

  @Column({ name: 'producer_id' })
  producerId: string;

  @ManyToOne(() => Producer, (producer) => producer.farms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'producer_id' })
  producer: Producer;

  @OneToMany(() => Plantio, (plantio) => plantio.farm)
  plantios: Plantio[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
