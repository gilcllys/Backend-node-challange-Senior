import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Farm } from '../../farms/entities/farm.entity';

@Entity('producers')
export class Producer extends BaseEntity {
  @Column({ name: 'cpf_cnpj', unique: true })
  cpfCnpj: string;

  @Column()
  name: string;

  @OneToMany(() => Farm, (farm) => farm.producer)
  farms: Farm[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
