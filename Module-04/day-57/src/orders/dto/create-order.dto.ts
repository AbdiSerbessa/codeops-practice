// src/orders/dto/create-order.dto.ts
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @Min(1)
  restaurantId!: number;

  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsString()
  @IsNotEmpty()
  area!: string;

  @IsInt()
  @Min(1)
  totalSantim!: number;
}