import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class UserDTO {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}