import { CreateComunidadDto } from './dto/create-comunidad.dto';
import { UpdateComunidadDto } from './dto/update-comunidad.dto';
import { Comunidad } from './entities/comunidad.entity';
import { PersonaService } from '../persona/persona.service';
export declare class ComunidadService {
    private readonly personaService;
    comunidades: Comunidad[];
    constructor(personaService: PersonaService);
    create(createComunidadDto: CreateComunidadDto): Comunidad;
    findAll(): Comunidad[];
    findOne(id: number): Comunidad;
    update(id: number, updateComunidadDto: UpdateComunidadDto): Comunidad;
    remove(id: number): boolean;
    addPersona(id: number, personaId: number): Comunidad;
    reactivatePersona(id: number, personaId: number): Comunidad;
    removePersona(id: number, personaId: number, operacionesCerradas?: boolean): Comunidad;
    deactivatePersona(id: number, personaId: number, operacionesCerradas?: boolean): import("../persona/entities/persona.entity").Persona;
    private nextId;
}
