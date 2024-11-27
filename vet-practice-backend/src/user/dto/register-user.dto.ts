import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  address: string;

  @IsString()
  phoneNumber: string;
}
