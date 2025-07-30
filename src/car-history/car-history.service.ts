import { Injectable } from '@nestjs/common';
import { CreateCarHistoryDto } from './dto/create-car-history.dto';
import { UpdateCarHistoryDto } from './dto/update-car-history.dto';

@Injectable()
export class CarHistoryService {
  create(createCarHistoryDto: CreateCarHistoryDto) {
    return 'This action adds a new carHistory';
  }

  findAll() {
    return `This action returns all carHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} carHistory`;
  }

  update(id: number, updateCarHistoryDto: UpdateCarHistoryDto) {
    return `This action updates a #${id} carHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} carHistory`;
  }
}
