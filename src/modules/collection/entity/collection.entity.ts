import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,Unique } from 'typeorm';
import { UserEntity } from 'src/modules/auth/entity/auth.entity';

@Entity('collections')
@Unique(['name','contractAddress'])
export class CollectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  contractAddress: string;

 
}

