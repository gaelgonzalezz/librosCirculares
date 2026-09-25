import { ComunidadService } from './comunidad.service';
import { CreateComunidadDto } from './dto/create-comunidad.dto';
import { UpdateComunidadDto } from './dto/update-comunidad.dto';
import { AfiliarPersonaDto } from './dto/afiliar-persona.dto';
import { BajaPersonaDto } from './dto/baja-persona.dto';
export declare class ComunidadController {
    private readonly comunidadService;
    constructor(comunidadService: ComunidadService);
    create(dto: CreateComunidadDto): import("./entities/comunidad.entity").Comunidad;
    findAll(): import("./entities/comunidad.entity").Comunidad[];
    findOne(id: string): import("./entities/comunidad.entity").Comunidad;
    update(id: string, dto: UpdateComunidadDto): import("./entities/comunidad.entity").Comunidad;
    remove(id: string): boolean;
    addPersona(id: string, dto: AfiliarPersonaDto): import("./entities/comunidad.entity").Comunidad;
    reactivatePersona(id: string, personaId: string): import("./entities/comunidad.entity").Comunidad;
    removePersona(id: string, personaId: string, dto: BajaPersonaDto): import("./entities/comunidad.entity").Comunidad;
    deactivatePersona(id: string, personaId: string, dto: BajaPersonaDto): import("../persona/entities/persona.entity").Persona;
}
