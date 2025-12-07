import { IsEmail, IsNotEmpty, IsString,} from "class-validator";





export class ResendOtpDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
}