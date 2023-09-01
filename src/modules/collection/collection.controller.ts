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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Import the CollectionService and CreateCollectionDto from their respective files
import { CollectionService } from './collection.service';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UpdateEnableDto } from './dto/collection.dto';

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
}
@Controller('collections') // Base route for this controllery
export class UserCollectionController {
  constructor(private readonly collectionsService: CollectionService) {}
  // Constructor injection of the CollectionService to use its methods

  // Route to get all collections
  @Get('/all') // HTTP GET request route: 'collections/all'
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
}
