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
  /**
   * Save a new collection to the database.
   *
   * @param data - An object containing collection data.
   * @returns A Promise that resolves to the saved CollectionEntity.
   */
  async saveCollection(data: {
    name: string;
    description: string;
    contractAddress: string;
    image: Buffer;
  }): Promise<CollectionEntity> {
    // Create a new instance of the CollectionEntity
    const collection = new CollectionEntity();

    // Set the properties of the collection from the input data
    collection.name = data.name;
    collection.description = data.description;
    collection.contractAddress = data.contractAddress;
    collection.image = data.image;

    // Save the collection entity to the database and return the result
    return await this.collectionRepository.save(collection);
  }

  /**
   * Change the 'isEnable' property of a collection by its ID.
   *
   * @param data - An object containing collection ID and new 'isEnabled' value.
   * @returns A Promise that resolves to the updated CollectionEntity.
   * @throws Error if the collection with the given ID is not found.
   */
  async changeIsEnable(data: any): Promise<CollectionEntity> {
    // Extract 'id' and 'isEnabled' values from the input data
    const { id, isEnable } = data;
    console.log(data)

    // Find the collection by its ID
    const collectionToUpdate = await this.collectionRepository.findOne({
      where: { id },
    });

    if (!collectionToUpdate) {
      // Throw an error if the collection with the specified ID is not found
      throw new Error(`Collection with ID ${id} not found`);
    }

    // Update the 'isEnable' property
    collectionToUpdate.isEnable = isEnable;

    // Save the updated collection
    return await this.collectionRepository.save(collectionToUpdate);
  }
}
