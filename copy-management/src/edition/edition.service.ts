import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEditionDto } from './dto/create-edition.dto';
import { UpdateEditionDto } from './dto/update-edition.dto';
import { Edition } from './entities/edition.entity';
import { BookService } from '../book/book.service';
import { PublisherService } from '../publisher/publisher.service';

@Injectable()
export class EditionService {
  constructor(private readonly bookService: BookService,
              private readonly publisherService: PublisherService
  ){

  }

  editions: Edition[] = [];

  create(createEditionDto: CreateEditionDto) {
    const book = this.bookService.findOne(createEditionDto.bookId);
    const publisher = this.publisherService.findOne(createEditionDto.publisherId);
    const newEdition = new Edition();
        
    newEdition.id = Math.random();
    newEdition.year = createEditionDto.year;
    newEdition.book = book;
    newEdition.publisher = publisher;

    
    this.editions.push(newEdition);
        
    return newEdition.id;
  }

  findAll() {
    return this.editions
  }

  findOne(id: number) {
    const editions = this.editions.find((e) => e.id == id)
    if(!editions){
      throw new NotFoundException();
    }
    return editions
  }

  update(id: number, updateEditionDto: UpdateEditionDto) {
    const edition = this.editions.find((e) => e.id == id)
    if(!edition){
      throw new NotFoundException();
    }
    if(updateEditionDto.year){
      edition.year = updateEditionDto.year;
    }

    if(updateEditionDto.bookId){
      edition.book = this.bookService.findOne(updateEditionDto.bookId);
    }
    
    if(updateEditionDto.publisherId){
      edition.publisher = this.publisherService.findOne(updateEditionDto.publisherId);
    }
  }

  remove(id: number) {
    this.editions = this.editions.filter((e) => e.id != id);
    return true;
  }
}