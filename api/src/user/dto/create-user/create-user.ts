import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsNotEmpty()
    @IsString()
    lastname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    isActive?: number;
    
}
