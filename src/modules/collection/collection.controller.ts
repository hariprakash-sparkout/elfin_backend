// Import necessary decorators and modules from Nest.js
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  NotAcceptableException,
  Delete,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Import the CollectionService and CreateCollectionDto from their respective files
import { CollectionService } from './collection.service';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { DeleteCollectionDto, UpdateCollectionDto, UpdateEnableDto } from './dto/collection.dto';

@Controller('collections') // Base route for this controller
@UseGuards(AuthGuard()) // Protect this route with the AuthGuard
export class CollectionController {
  constructor(private readonly collectionsService: CollectionService) {}
  // Constructor injection of the CollectionService to use its methods

  // POST endpoint to create a collection
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async uploadCollection(
    @UploadedFile() image: Express.Multer.File,
    @Body()
    body: { name: string; description: string; contractAddress: string },
  ): Promise<any> {
    try {
      // Check if the image file is missing
      if (!image) {
        throw new BadRequestException('Image file is required');
      }

      // Call the collections service to save the collection
      const savedCollection = await this.collectionsService.saveCollection({
        ...body,
        image: image.buffer,
      });

      // Return the saved collection as a response
      return {
        message: 'Collection created successfully',
        collection: savedCollection,
      };
    } catch (error) {
      // Handle any errors and return an appropriate response

      throw new NotAcceptableException(error.message);
    }
  }

  // POST endpoint to enable/disable a collection
  @Post('update-enable')
  async isEnable(@Body() data: UpdateEnableDto): Promise<any> {
    try {
      // Call the collections service to change the isEnable value
      const updatedCollection = await this.collectionsService.changeIsEnable(
        data,
      );

      // Return the updated collection as a response
      return {
        message: 'Collection isEnable status updated successfully',
        collection: updatedCollection,
      };
    } catch (error) {
      // Handle any errors and return an appropriate response

      throw new NotAcceptableException(error.message);
    }
  }
  // DELETE endpoint to delete a collection by ID
  @Post('/delete')
  async deleteCollection(@Body() dto: DeleteCollectionDto): Promise<any> {
    try {
      // Call the collections service to delete the collection by ID
      const deletedCollection =
        await this.collectionsService.deleteCollectionById(dto.id);

      if (!deletedCollection) {
        // If the collection was not found, throw a NotFoundException
        throw new NotFoundException(`Collection with ID ${dto.id} not found`);
      }

      // Return a success message or an appropriate response
      return {
        message: 'Collection deleted successfully',
        collection: deletedCollection,
      };
    } catch (error) {
      // Handle any errors and return an appropriate response
      throw error; // You can customize error handling as needed
    }
  }

  @Post('/update')
  async updateCollection(
    @Body() body:UpdateCollectionDto,
  ): Promise<any> {
    try {
      const { id, ...updateData } = body;

      // Call the collections service to update the collection
      const updatedCollection = await this.collectionsService.updateCollection(id, updateData);

      if (!updatedCollection) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }

      // Return the updated collection as a response
      return {
        message: 'Collection updated successfully',
        collection: updatedCollection,
      };
    } catch (error) {
      // Handle any errors and return an appropriate response

      throw new NotAcceptableException(error.message);
    }
  }
}
@Controller('collections') // Base route for this controllery
export class UserCollectionController {
  constructor(private readonly collectionsService: CollectionService) {}
  // Constructor injection of the CollectionService to use its methods

  // Route to get all collections
  @Get('/get-all') // HTTP GET request route: 'collections/all'
  async getAllCollection(): Promise<any> {
    try {
      // Fetch all collections using the 'getAllCollections' method from the service
      const collections = await this.collectionsService.getAllCollections();

      // Return the fetched collections as the response
      return collections;
    } catch (error) {
      // Handle the error if something goes wrong during collection retrieval
      throw new Error(error?.message);
    }
  }

  @Post('/get-collection')
  async getCollectionByAddress(@Body() data: any): Promise<any> {
    let { contractAddress } = data;
    try {
      // Call the collectionsService method to get collection details by contract address
      const collectionDetails =
        await this.collectionsService.getCollectionByAddress(contractAddress);

      // Return the collection details if successful
      return collectionDetails;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error while fetching collection details:', error);

      // Return an error response
      throw new NotFoundException('No Pools found')
    }
  }
}
