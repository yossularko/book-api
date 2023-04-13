import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entity/book.entity';
import { BookRepository } from './repository/book.repository';

@Injectable()
export class BooksService {
  constructor(private readonly bookRepository: BookRepository) {}

  async getBooks(filterBookDto: FilterBookDto): Promise<Book[]> {
    return await this.bookRepository.getBooks(filterBookDto);
  }

  async getBookById(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} is not found`);
    }

    return book;
  }

  async createBook(createBookDto: CreateBookDto): Promise<void> {
    return await this.bookRepository.createBook(createBookDto);
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<void> {
    const { title, author, category, year } = updateBookDto;

    const book = await this.getBookById(id);
    book.title = title;
    book.author = author;
    book.category = category;
    book.year = year;

    await book.save();
  }

  async deleteBook(id: string): Promise<void> {
    const result = await this.bookRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Book with id ${id} is not found`);
    }
  }
}
