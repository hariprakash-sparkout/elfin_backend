import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionEntity } from './entity/collection.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { UserEntity } from '../auth/entity/auth.entity';
import { CreateCollectionDto } from './dto/collection.dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: Repository<CollectionEntity>,
  ) {}

  // Method to create a new collection
  async createCollection(
    createCollectionDto: any,
  ): Promise<any> {
    try {
      // Attempt to create the collection
      const newCollection = await this.collectionRepository.create(createCollectionDto);
      return await this.collectionRepository.save(newCollection);
    } catch (error) {
      // Check if the error is a duplicate entry error
      if (error instanceof QueryFailedError && error.message.includes('UNIQUE constraint failed')) {
        const match = error.message.match(/UNIQUE constraint failed: (.+)/);
        if (match && match[1]) {
          const columns = match[1].split(', ');
          const columnNames = columns.map((col) => col.split('.')[1]); // Extract column names
          throw new ConflictException(`Duplicate entry. The combination of ${columnNames.join(' and ')} already exists.`);
        }
      }
      // Handle other errors here
      throw error;
    }

  }
  

  // Method to get all collections
  async getAllCollections(): Promise<CollectionEntity[]> {
    try {
      // Fetch all collections from the database
      return await this.collectionRepository.find();
    } catch (error) {
      // Handle the error if something goes wrong during collection retrieval
      throw new Error('An error occurred while fetching collections.');
    }
  }
}
