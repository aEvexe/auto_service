export class CreateUserDto {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirm_password: string;
  activation_link?: string
}
