import { Injectable } from "@nestjs/common";
import { CreateDistrictDto } from "./dto/create-district.dto";
import { UpdateDistrictDto } from "./dto/update-district.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DistrictService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(createDistrictDto: CreateDistrictDto) {
    return this.prisma.district.create({
      data: createDistrictDto,
    });
  }

  // READ ALL
  async findAll() {
    return this.prisma.district.findMany({
      include: { region: true }, // bog‘langan regionni ham chiqaradi
    });
  }

  // READ ONE
  async findOne(id: number) {
    return this.prisma.district.findUnique({
      where: { id },
      include: { region: true },
    });
  }

  // UPDATE
  async update(id: number, updateDistrictDto: UpdateDistrictDto) {
    return this.prisma.district.update({
      where: { id },
      data: updateDistrictDto,
    });
  }

  // DELETE
  async remove(id: number) {
    return this.prisma.district.delete({
      where: { id },
    });
  }
}
