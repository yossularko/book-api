import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtGuard } from 'src/guard/jwt.guard';
import { UUIDValidationPipe } from 'src/pipes/uuid-validation.pipe';
import { User } from 'src/users/entity/user.entity';
import { BooksService } from './books.service';
import { BookDto } from './dto/book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entity/book.entity';

@ApiTags('Book')
@Controller('books')
@UseGuards(JwtGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOkResponse({
    isArray: true,
    type: BookDto,
  })
  @Get()
  async getBooks(
    @GetUser() user: User,
    @Query() filter: FilterBookDto,
  ): Promise<Book[]> {
    return await this.booksService.getBooks(user, filter);
  }

  @ApiOkResponse({
    type: BookDto,
  })
  @Get('/:id')
  async getBookById(
    @GetUser() user: User,
    @Param('id', UUIDValidationPipe) id: string,
  ): Promise<Book> {
    return await this.booksService.getBookById(user, id);
  }

  @Post()
  async createBook(
    @GetUser() user: User,
    @Body() payload: CreateBookDto,
  ): Promise<void> {
    return await this.booksService.createBook(user, payload);
  }

  @Put('/:id')
  async updateBook(
    @GetUser() user: User,
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: UpdateBookDto,
  ): Promise<void> {
    return await this.booksService.updateBook(user, id, payload);
  }

  @Delete('/:id')
  async deleteBook(
    @GetUser() user: User,
    @Param('id', UUIDValidationPipe) id: string,
  ): Promise<void> {
    return await this.booksService.deleteBook(user, id);
  }
}
