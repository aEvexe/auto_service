import { Injectable } from "@nestjs/common";
import { CreateCarHistoryDto } from "./dto/create-car-history.dto";
import { UpdateCarHistoryDto } from "./dto/update-car-history.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CarHistoryService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(createCarHistoryDto: CreateCarHistoryDto) {
    return this.prisma.carHistory.create({
      data: createCarHistoryDto,
    });
  }

  // READ ALL
  async findAll() {
    return this.prisma.carHistory.findMany({
      include: { car: true }, // bog‘langan mashina ma'lumotini ham chiqaradi
    });
  }

  // READ ONE
  async findOne(id: number) {
    return this.prisma.carHistory.findUnique({
      where: { id },
      include: { car: true },
    });
  }

  // UPDATE
  async update(id: number, updateCarHistoryDto: UpdateCarHistoryDto) {
    return this.prisma.carHistory.update({
      where: { id },
      data: updateCarHistoryDto,
    });
  }

  // DELETE
  async remove(id: number) {
    return this.prisma.carHistory.delete({
      where: { id },
    });
  }
}
