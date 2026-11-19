import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsValidScheduleForMode } from '../../common/validators/delivery-time.validator.js';
import { IsSantim } from '../../common/validators/is-santim.validator.js';
import { IsTeleBirrNumber } from '../../common/validators/is-telebirr-number.validator.js';

export class OrderLineDto {
  @IsInt({ message: 'dishId must be a whole number.' })
  @Min(1, { message: 'dishId must be a positive dish identifier.' })
  dishId!: number;

  @IsInt({ message: 'quantity must be a whole number.' })
  @Min(1, { message: 'quantity must be at least 1.' })
  @Max(20, { message: 'quantity cannot exceed 20 per line.' })
  quantity!: number;
}

export class CreateOrderDto {
  @IsInt({ message: 'restaurantId must be a whole number.' })
  @Min(1, { message: 'restaurantId must be a positive identifier.' })
  restaurantId!: number;

  @IsString()
  @IsNotEmpty({ message: 'customerName is required.' })
  customerName!: string;

  @IsTeleBirrNumber()
  customerPhone!: string;

  @IsString()
  @IsNotEmpty({ message: 'area is required.' })
  area!: string;

  @IsIn(['ASAP', 'SCHEDULED'], {
    message: 'deliveryMode must be either ASAP or SCHEDULED.',
  })
  deliveryMode: 'ASAP' | 'SCHEDULED' = 'ASAP';

  @IsValidScheduleForMode()
  scheduledAt?: string;

  @IsOptional()
  @IsSantim()
  tipSantim?: number;

  @IsArray({ message: 'lines must be an array of order items.' })
  @ArrayMinSize(1, { message: 'Order must contain at least one line item.' })
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  lines!: OrderLineDto[];
}