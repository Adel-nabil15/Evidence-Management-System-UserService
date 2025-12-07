import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length, ValidateIf } from "class-validator";
import { IsMatch } from "src/common/decorator/user.decorator";





export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 200, { message: "First name must be between 3 and 200 characters" })
    @ValidateIf((data: SignUpDto) => { return Boolean(!data.userName) })
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 200, { message: "Last name must be between 3 and 200 characters" })
    @ValidateIf((data: SignUpDto) => { return Boolean(!data.userName) })
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 200, { message: "User name must be between 3 and 200 characters" })
    @ValidateIf((data: SignUpDto) => { return Boolean(!data.firstName && !data.lastName) })
    userName: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string

    @IsMatch(["password"])
    @ValidateIf((data: SignUpDto) => {
        return Boolean(data.password)
    })
    confirmpassword: string
}