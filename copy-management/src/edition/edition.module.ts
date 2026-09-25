import { Module } from '@nestjs/common';
import { EditionService } from './edition.service';
import { EditionController } from './edition.controller';
import { Author } from '../author/entities/author.entity';
import { AuthorModule } from '../author/author.module';
import { BookService } from '../book/book.service';
import { PublisherService } from '../publisher/publisher.service';

@Module({
  imports: [BookService, PublisherService],
  controllers: [EditionController],
  providers: [EditionService],
})
export class EditionModule {}
