import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Plantio } from '../../plantios/entities/plantio.entity';

@Entity('cultures_planted')
export class CulturePlanted extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Plantio, (plantio) => plantio.culturePlanted)
  plantios: Plantio[];
}
