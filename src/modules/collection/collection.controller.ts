// Import necessary decorators and modules from Nest.js
import { Controller, UseGuards, Post, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Import the CollectionService and CreateCollectionDto from their respective files
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/collection.dto';

@Controller('collections') // Base route for this controller
@UseGuards(AuthGuard()) // Protect this route with the AuthGuard
export class CollectionController {
  constructor(private readonly collectionsService: CollectionService) {}
  // Constructor injection of the CollectionService to use its methods

  @Post('create') // HTTP POST request route: 'collections/create'
  async createCollection(@Body() data: CreateCollectionDto): Promise<any> {
    // Handler for creating a collection, expecting data in the request body
    // Call the 'createCollection' method from the injected collectionsService
    const collection = await this.collectionsService.createCollection(data);

    // Return the created collection as the response
    return collection;
  }

  // Route to get all collections
  @Get('all') // HTTP GET request route: 'collections/all'
  async getAllCollection(): Promise<any> {
    try {
      // Fetch all collections using the 'getAllCollections' method from the service
      const collections = await this.collectionsService.getAllCollections();

      // Return the fetched collections as the response
      return collections;
    } catch (error) {
      // Handle the error if something goes wrong during collection retrieval
      throw new Error('An error occurred while fetching collections.');
    }
  }
}
