import { Injectable } from "@nestjs/common";
import { CreateRegionDto } from "./dto/create-region.dto";
import { UpdateRegionDto } from "./dto/update-region.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RegionsService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(createRegionDto: CreateRegionDto) {
    return this.prisma.regions.create({
      data: createRegionDto,
    });
  }

  // READ ALL
  async findAll() {
    return this.prisma.regions.findMany({
      include: { District: true }, // region ichidagi districtlarni ham olish
    });
  }

  // READ ONE
  async findOne(id: number) {
    return this.prisma.regions.findUnique({
      where: { id },
      include: { District: true },
    });
  }

  // UPDATE
  async update(id: number, updateRegionDto: UpdateRegionDto) {
    return this.prisma.regions.update({
      where: { id },
      data: updateRegionDto,
    });
  }

  // DELETE
  async remove(id: number) {
    return this.prisma.regions.delete({
      where: { id },
    });
  }
}
