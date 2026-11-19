import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FindRestaurantsQueryDto {
  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  cuisine?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number = 0;

  @IsOptional()
  @IsIn(['id', '-id', 'name', '-name', 'area', '-area'])
  sort: string = 'id';

  @IsOptional()
  @IsString()
  fields?: string;
}