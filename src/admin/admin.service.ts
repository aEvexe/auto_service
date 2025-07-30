import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    return await this.prisma.admin.create({
      data: {
        full_name: createAdminDto.full_name,
        email: createAdminDto.email,
        phone: createAdminDto.phone,
        hashedPassword: await bcrypt.hash(createAdminDto.password, 10), // <-- hash here
        is_creator: createAdminDto.is_creator ?? false,
      },
    });
  }

  async findAll() {
    return await this.prisma.admin.findMany();
  }

  async findById(id: number) {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin with id #${id} not found`);
    }
    return admin;
  }

  async findOne(id: number) {
    return await this.prisma.admin.findUnique({ where: { id } });
  }

  async findUserByEmail(email: string) {
    return await this.prisma.admin.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    try {
      return await this.prisma.admin.update({
        where: { id },
        data: updateAdminDto,
      });
    } catch (error) {
      throw new NotFoundException(`Admin with id #${id} not found`);
    }
  }

  async remove(id: number) {
    await this.prisma.admin.delete({ where: { id } });
    return { id };
  }
}
