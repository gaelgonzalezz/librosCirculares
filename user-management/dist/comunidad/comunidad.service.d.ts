import { CreateComunidadDto } from './dto/create-comunidad.dto';
import { UpdateComunidadDto } from './dto/update-comunidad.dto';
import { Comunidad } from './entities/comunidad.entity';
import { PersonaService } from '../persona/persona.service';
export declare class ComunidadService {
    private readonly personaService;
    constructor(personaService: PersonaService);
    comunidades: Comunidad[];
    siguienteId(): number;
    create(createComunidadDto: CreateComunidadDto): number;
    findAll(): Comunidad[];
    findOne(id: number): Comunidad;
    update(id: number, updateComunidadDto: UpdateComunidadDto): void;
    remove(id: number): boolean;
    estaAfiliada(comunidad: Comunidad, personaId: number): boolean;
    estaActiva(comunidad: Comunidad, personaId: number): boolean;
    comunidadesDe(personaId: number): Comunidad[];
    comunidadesActivasDe(personaId: number): Comunidad[];
    operacionesCerradas(idPersona: number, idComunidad: number): Promise<boolean>;
    altaPersona(idComunidad: number, idPersona: number): Promise<void>;
    bajaPersona(idComunidad: number, idPersona: number): Promise<boolean>;
    desactivarPersona(idComunidad: number, idPersona: number): Promise<boolean>;
    quitarPersonaDeTodas(idPersona: number): void;
}
