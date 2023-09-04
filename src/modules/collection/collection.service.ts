import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    console.log(data);

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

  // Function to get a collection by contract address
  async getCollectionByAddress(
    contractAddress: string,
  ): Promise<CollectionEntity> {
    // Find the collection by its address
    const collection = await this.collectionRepository.findOne({
      where: { contractAddress },
    });

    if (!collection) {
      // If the collection was not found, throw a NotFoundException
      throw new NotFoundException(
        `Collection with contract address ${contractAddress} not found`,
      );
    }

    return collection;
  }

  // Function to delete a collection by ID
  async deleteCollectionById(
    id: number,
  ): Promise<CollectionEntity | undefined> {
    // Find the collection by ID
    const collectionToDelete = await this.collectionRepository.findOne({
      where: { id },
    });

    if (!collectionToDelete) {
      // If the collection was not found, throw a NotFoundException
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }

    // Delete the collection
    await this.collectionRepository.remove(collectionToDelete);

    // Return the deleted collection
    return collectionToDelete;
  }

  async updateCollection(
    id: number,
    data: { name?: string; description?: string; contractAddress?: string },
  ): Promise<CollectionEntity | undefined> {
    // Find the collection by its ID
    const collectionToUpdate = await this.collectionRepository.findOne({where: { id }});

    if (!collectionToUpdate) {
      return undefined; // Collection not found
    }

    // Update the collection properties
    if (data.name) {
      collectionToUpdate.name = data.name;
    }
    if (data.description) {
      collectionToUpdate.description = data.description;
    }
    if (data.contractAddress) {
      collectionToUpdate.contractAddress = data.contractAddress;
    }

    // Save the updated collection
    return await this.collectionRepository.save(collectionToUpdate);
  }
}
