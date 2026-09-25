import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { AuthorService } from '../author/author.service';
import { GenreService } from '../genre/genre.service';

@Injectable()
export class BookService {
  constructor(private readonly authorService: AuthorService,
              private readonly genreService: GenreService){

  }

  books: Book[] = [];

  create(createBookDto: CreateBookDto) {
    const genre = this.genreService.findOne(createBookDto.genreId);
    const authors = createBookDto.authorsId.map((a) => this.authorService.findOne(a));
    const newBook = new Book();
    
    newBook.id = Math.random();
    newBook.name = createBookDto.name;
    newBook.genre = genre;
    newBook.authors = authors;

    this.books.push(newBook);
    
    return newBook.id;
  }

  findAll() {
    return this.books
  }

  findOne(id: number) {
    const books = this.books.find((b) => b.id == id)
    if(!books){
      throw new NotFoundException();
    }
    return books
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    const books = this.books.find((b) => b.id == id)
    if(!books){
      throw new NotFoundException();
    }
    if(updateBookDto.name){
      books.name = updateBookDto.name;
    }

    if(updateBookDto.genreId){
      books.genre = this.genreService.findOne(updateBookDto.genreId);
    }
    
    if(updateBookDto.authorsId){
      books.authors = updateBookDto.authorsId.map((a) => this.authorService.findOne(a))
    }
  }

  remove(id: number) {
    this.books = this.books.filter((b) => b.id != id);
    return true;
  }
}