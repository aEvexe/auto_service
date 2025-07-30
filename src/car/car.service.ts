import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(createCarDto: CreateCarDto) {
    return this.prisma.car.create({
      data: createCarDto,
    });
  }

  // READ ALL
  async findAll() {
    return this.prisma.car.findMany();
  }

  // READ ONE
  async findOne(id: number) {
    return this.prisma.car.findUnique({
      where: { id },
    });
  }

  // UPDATE
  async update(id: number, updateCarDto: UpdateCarDto) {
    return this.prisma.car.update({
      where: { id },
      data: updateCarDto,
    });
  }

  // DELETE
  async remove(id: number) {
    return this.prisma.car.delete({
      where: { id },
    });
  }
}
