import { IsEmail, IsNotEmpty, IsString, Length, } from "class-validator";

// forget password dto
export class ForgetPasswordDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
}

// reset password dto
export class ResetPasswordDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    @Length(6, 6, { message: "Otp must be 6 characters" })
    @IsNotEmpty()
    code: string;
    @IsString()
    @IsNotEmpty()
    @Length(6, 200, { message: "Password must be between 6 and 200 characters" })
    newPassword: string;
}
