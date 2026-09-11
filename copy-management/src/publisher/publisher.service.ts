import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Publisher } from './entities/publisher.entity';

@Injectable()
export class PublisherService {
  publishers: Publisher[] = [];

  create(createPublisherDto: CreatePublisherDto) {
    const newPublisher = new Publisher();
    newPublisher.id = Math.random();
    newPublisher.name = createPublisherDto.name;
        
    this.publishers.push(newPublisher);
    
    return newPublisher.id;
  }

  findAll() {
    return this.publishers;
  }

  findOne(id: number) {
    const publisher = this.publishers.find((p) => p.id == id)
    if(!publisher){
      throw new NotFoundException();
    }
    return publisher
  }

  update(id: number, updatePublisherDto: UpdatePublisherDto) {
    const publisher = this.publishers.find((p) => p.id == id)
    if(!publisher){
      throw new NotFoundException();
    }

    if(updatePublisherDto.name){
      publisher.name = updatePublisherDto.name
    }
  }

  remove(id: number) {
    this.publishers = this.publishers.filter((p) => p.id != id);
    return true;
  }
}
