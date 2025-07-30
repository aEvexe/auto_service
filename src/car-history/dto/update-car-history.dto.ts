import { PartialType } from '@nestjs/mapped-types';
import { CreateCarHistoryDto } from './create-car-history.dto';

export class UpdateCarHistoryDto extends PartialType(CreateCarHistoryDto) {}
