import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateBookDto {
  @ApiProperty({ default: '8 Jam Jago React JS' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ default: 'J.R.R. Tolkien' })
  @IsNotEmpty()
  author: string;

  @ApiProperty({ default: 'front-end' })
  @IsNotEmpty()
  category: string;

  @ApiProperty({ default: 2020 })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  year: number;
}
