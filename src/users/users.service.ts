import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto, UpdateUserDto } from "./dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, phone, password, confirm_password } = createUserDto;
    if (password != confirm_password) {
      throw new BadRequestException("Password or email is incorrect");
    }
    const hashedPassword = await bcrypt.hash(password!, 7);

    return this.prismaService.user.create({
      data: {
        name,
        email,
        phone,
        hashedPassword,
      },
    });
  }

  findAll() {
    return this.prismaService.user.findMany()
  }

  findOne(id: number) {
    return this.prismaService.user.findUnique({where: {id}})
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
    return user
  }

  remove(id: number) {
    return this.prismaService.user.delete({where: {id}});
  }
}
