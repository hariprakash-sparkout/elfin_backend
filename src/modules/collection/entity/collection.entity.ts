import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('collections')
@Unique(['name', 'contractAddress'])
export class CollectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @Column()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;

  @Column('blob', { nullable: true })
  image: Buffer;

  @Column()
  @IsNotEmpty({ message: 'Contract Address cannot be empty' })
  contractAddress: string;

  @Column()
  isEnable: boolean = false;
}
