import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';

export class BookDto extends PartialType(CreateBookDto) {
  @ApiProperty({ default: '6d447d19-d4d6-411d-a700-cbcc2350b7b9' })
  id: string;
}
