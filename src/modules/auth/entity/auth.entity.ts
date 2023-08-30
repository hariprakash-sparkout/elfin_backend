// src/tasks/task.entity.ts
import { Entity, Column, PrimaryGeneratedColumn ,Unique} from 'typeorm';



@Entity()
@Unique(['username']) // Use the @Unique decorator on the entity class

export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

}