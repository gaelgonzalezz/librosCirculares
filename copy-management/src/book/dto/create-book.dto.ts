import { Genre } from "../../genre/entities/genre.entity";
import { Author } from "../../author/entities/author.entity";

export class CreateBookDto {
    id: number;
    name: string;
    genreId: number;
    authorsId: number[];
}