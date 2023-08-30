import { IsNotEmpty,IsString } from 'class-validator';


export class CreateCollectionDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  contractAddress: string;
}
