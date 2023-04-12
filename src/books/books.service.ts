import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Books {
  id: string;
  title: string;
  author: string;
  category: string;
}

@Injectable()
export class BooksService {
  private books: Books[] = [];

  getAllBook(): Books[] {
    return this.books;
  }

  getBookById(id: string) {
    const idx = this.findBookById(id);

    return this.books[idx];
  }

  createBook(title: string, author: string, category: string) {
    this.books.push({ id: uuidv4(), title, author, category });
    return { id: uuidv4(), title, author, category };
  }

  updateBook(id: string, title: string, author: string, category: string) {
    const idx = this.findBookById(id);

    this.books[idx].title = title;
    this.books[idx].author = author;
    this.books[idx].category = category;

    return { id, title, author, category };
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
