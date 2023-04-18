import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ default: '07498b59-30e9-41b8-b836-b2d11885b10d' })
  id: string;

  @ApiProperty({ default: 'Yos Sularko' })
  name: string;

  @ApiProperty({ default: 'yoas@admin.com' })
  email: string;
}
