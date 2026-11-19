import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 'Yod Abyssinia' })
  @IsString()
  @IsNotEmpty()
  restaurant!: string;

  @ApiProperty({ example: 'bole' })
  @IsString()
  @IsNotEmpty()
  area!: string;

  @ApiProperty({ example: '+251911223344' })
  @IsString()
  @IsNotEmpty()
  customerPhone!: string;

  @ApiProperty({ example: 85000, minimum: 1 })
  @IsInt()
  @Min(1)
  totalSantim!: number;
}