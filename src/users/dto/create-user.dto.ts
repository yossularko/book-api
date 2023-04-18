import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ default: 'Yos Sularko' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: 'yoas@admin.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'admin123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
