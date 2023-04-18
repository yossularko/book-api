import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FilterBookDto {
  @ApiProperty({ required: false })
  @IsOptional()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  author: string;

  @ApiProperty({ required: false })
  @IsOptional()
  category: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  min_year: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  max_year: number;

  @ApiProperty({ required: false })
  @IsOptional()
  search: string;
}
