import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Plantio } from '../../plantios/entities/plantio.entity';

@Entity('safras')
export class Safra extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Plantio, (plantio) => plantio.safra)
  plantios: Plantio[];
}
