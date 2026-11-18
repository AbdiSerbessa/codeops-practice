import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customer!: string;

  @IsString()
  @IsNotEmpty()
  area!: string;

  @IsInt()
  @IsPositive()
  totalSantim!: number;

  @IsOptional()
  @IsString()
  @Matches(/^(09|07)\d{8}$/, {
    message: 'telebirrPhone must be a valid 10-digit Ethiopian phone number starting with 09 or 07',
  })
  telebirrPhone?: string;
}