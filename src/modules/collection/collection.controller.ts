// Import necessary decorators and modules from Nest.js
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Import the CollectionService and CreateCollectionDto from their respective files
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/collection.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { CollectionEntity } from './entity/collection.entity';
@Controller('collections') // Base route for this controller
// @UseGuards(AuthGuard()) // Protect this route with the AuthGuard
export class CollectionController {
  constructor(private readonly collectionsService: CollectionService) {}
  // Constructor injection of the CollectionService to use its methods

  @Post('create') // HTTP POST request route: 'collections/create'
  @UseInterceptors(FileInterceptor('image'))
  async createCollection(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCollectionDto: CreateCollectionDto,
  ) {
    try {
      // Save the image to a local folder
      const uploadPath = path.join(
        __dirname,
        '..',
        'uploads',
        file.originalname,
      );
      fs.writeFileSync(uploadPath, file.buffer);
  
      // Save the image information to the database
      const collection = new CollectionEntity();
      collection.name = createCollectionDto.name;
      collection.description = createCollectionDto.description;
      collection.image = fs.readFileSync(uploadPath); // Store the binary data directly
      collection.contractAddress = createCollectionDto.contractAddress;
  
      await this.collectionsService.createCollection(collection);
  
      return { message: 'Image uploaded and saved successfully' };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Error uploading image');
    }
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
