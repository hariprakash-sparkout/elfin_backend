import { IsBoolean, IsNotEmpty,IsNumber,IsString, isBoolean } from 'class-validator';


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

export class UpdateEnableDto{

  @IsNotEmpty()
  @IsNumber()
  id:number

  @IsNotEmpty()
  @IsBoolean()
  isEnable:boolean
}

export class DeleteCollectionDto{

  @IsNotEmpty()
  @IsNumber()
  id:number
}

export interface UpdateCollectionDto {
  id: number;
  name?: string;
  description?: string;
  contractAddress?: string;
}
