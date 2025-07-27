import { IsEmail, IsString, Length } from "class-validator";

export class CreateAdminDto {
  @IsString()
  @Length(1, 100)
  full_name: string;

  @IsString()
  @Length(1, 100)
  phone: string;

  @IsEmail()
  @Length(1, 100)
  email: string;

  @IsString()
  @Length(1, 100)
  password: string;

  @IsString()
  @Length(1, 100)
  is_creator: string;
}
