import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCopyDto } from './dto/create-copy.dto';
import { UpdateCopyDto } from './dto/update-copy.dto';
import { Copy } from './entities/copy.entity';
import { EditionService } from '../edition/edition.service';

@Injectable()
export class CopyService {
  constructor(private readonly editionService: EditionService){
    }

  copies: Copy[] = [];

  create(createCopyDto: CreateCopyDto) {
    const edition = this.editionService.findOne(createCopyDto.editionId);
    const newCopy = new Copy();
        
    newCopy.id = Math.random();
    newCopy.edition = edition;
    newCopy.ownerId = createCopyDto.ownerId;
    newCopy.inPosessionId = createCopyDto.inPosessionId;
    newCopy.active = createCopyDto.active ?? true;
    
    this.copies.push(newCopy);
        
    return newCopy.id;
  }

  findAll() {
    return this.copies;
  }

  findOne(id: number) {
    const copies = this.copies.find((c) => c.id == id)
    if(!copies){
      throw new NotFoundException();
    }
    return copies;
  }

  update(id: number, updateCopyDto: UpdateCopyDto) {
    const copies = this.copies.find((c) => c.id == id)
    if(!copies){
      throw new NotFoundException();
    }
    if(updateCopyDto.editionId){
      copies.edition = this.editionService.findOne(updateCopyDto.editionId);
    }

    if(updateCopyDto.ownerId){
      copies.ownerId = updateCopyDto.ownerId;
    }

    if(updateCopyDto.inPosessionId){
      copies.inPosessionId = updateCopyDto.inPosessionId;
    }

    if(updateCopyDto.active !== undefined){
      copies.active = updateCopyDto.active;
    }

    return copies;

  }
  
  remove(id: number) {
    this.copies = this.copies.filter((c) => c.id != id);
    return true;
  }
}

