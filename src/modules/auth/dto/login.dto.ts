import { IsEmail, IsNotEmpty, IsString, Length, } from "class-validator";


export class LoginDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @Length(6, 200, { message: "Password must be between 6 and 200 characters" })
    @IsNotEmpty()
    password: string;
}