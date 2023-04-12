import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

export interface Books {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
}

@Injectable()
export class BooksService {
  private books: Books[] = [];

  getBooks(
    title?: string,
    author?: string,
    category?: string,
    search?: string,
  ): Books[] {
    const books = this.books.filter((book) => {
      if (search) {
        return (
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase()) ||
          book.category.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (title) {
        return book.title.toLowerCase().includes(title.toLowerCase());
      }

      if (author) {
        return book.author.toLowerCase().includes(author.toLowerCase());
      }

      if (category) {
        return book.category.toLowerCase().includes(category.toLowerCase());
      }

      return true;
    });
    return books;
  }

  getBookById(id: string) {
    const idx = this.findBookById(id);

    return this.books[idx];
  }

  createBook(createBookDto: CreateBookDto) {
    const { title, author, category, year } = createBookDto;
    this.books.push({
      id: uuidv4(),
      title,
      author,
      category,
      year: Number(year),
    });
    return { id: uuidv4(), title, author, category, year: Number(year) };
  }

  updateBook(id: string, updateBookDto: UpdateBookDto) {
    const { title, author, category, year } = updateBookDto;
    const idx = this.findBookById(id);

    this.books[idx].title = title;
    this.books[idx].author = author;
    this.books[idx].category = category;
    this.books[idx].year = Number(year);

    return { id, title, author, category, year: Number(year) };
  }

  deleteBook(id: string) {
    const idx = this.findBookById(id);
    this.books.splice(idx, 1);

    return `Success delete book id: ${id}`;
  }

  findBookById(id: string) {
    const idx = this.books.findIndex((book) => book.id === id);
    if (idx === -1) {
      throw new NotFoundException(`Book with id ${id} is not found`);
    }

    return idx;
  }
}
