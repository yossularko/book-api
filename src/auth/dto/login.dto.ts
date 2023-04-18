import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ default: 'yos@admin.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: 'admin123' })
  @IsNotEmpty()
  password: string;
}
