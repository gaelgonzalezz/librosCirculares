import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorService {
  authors: Author[] = [];

  create(createAuthorDto: CreateAuthorDto) {
    const newAuthor = new Author();
    newAuthor.id = Math.random();
    newAuthor.name = createAuthorDto.name;
    newAuthor.lastName = createAuthorDto.lastName;
    newAuthor.nationality = createAuthorDto.nationality;
    newAuthor.residency = createAuthorDto.residency;
         
    this.authors.push(newAuthor);
    
    return newAuthor.id;
  }

  findAll() {
    return this.authors;
  }

  findOne(id: number) {
    const author = this.authors.find((a) => a.id == id)
        if(!author){
          throw new NotFoundException();
        }
        return author
  }

  update(id: number, updateAuthorDto: UpdateAuthorDto) {
    const author = this.authors.find((a) => a.id == id)
    if(!author){
      throw new NotFoundException();
    }
    author.name = updateAuthorDto.name;
    author.lastName = updateAuthorDto.lastName;
    author.nationality = updateAuthorDto.nationality;
    author.residency = updateAuthorDto.residency;
  }

  remove(id: number) {
    this.authors = this.authors.filter((a) => a.id != id);
    return true;
  }
}
