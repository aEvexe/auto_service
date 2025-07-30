export class CreateCarHistoryDto {
  car_id: number;
  owner_id: number;
  buyed_at: Date;
  sold_at?: Date;
}
