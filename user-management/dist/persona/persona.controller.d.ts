import { PersonaService } from './persona.service';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
export declare class PersonaController {
    private readonly personaService;
    constructor(personaService: PersonaService);
    create(createPersonaDto: CreatePersonaDto): number;
    findAll(): import("./entities/persona.entity").Persona[];
    findOne(id: string): import("./entities/persona.entity").Persona;
    update(id: string, updatePersonaDto: UpdatePersonaDto): void;
    remove(id: string): boolean;
}
