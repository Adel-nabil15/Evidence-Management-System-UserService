import { IsEmail, IsNotEmpty, IsString, Length, } from "class-validator";


export class ConfirmEmailDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 6, { message: "Otp must be 6 characters" })
    code: string;
}