import { IsNotEmpty, IsString ,MinLength} from "class-validator";

export class RegisterDto{

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly username:string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password:string

}