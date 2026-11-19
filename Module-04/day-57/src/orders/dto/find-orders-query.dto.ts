import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FindOrdersQueryDto {
  @IsOptional()
  @IsString()
  status?: string; // supports comma-separated values: ?status=PENDING,PREPARING

  @IsOptional()
  @IsString()
  area?: string; // supports comma-separated values: ?area=Bole,Atlas

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
  @IsIn(['id', '-id', 'totalSantim', '-totalSantim', 'area', '-area'])
  sort: string = 'id';

  @IsOptional()
  @IsString()
  fields?: string; // sparse fieldsets: ?fields=id,customerName,totalSantim
}