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

  @Column('blob', { nullable: true })
  image: Buffer; // Use 'blob' and Buffer for binary data

  @Column()
  contractAddress: string;

 
}

