import { CreatePersonaDto } from './dto/create-persona.dto';
import { CreateMedioContactoDto } from '../medio-contacto/dto/create-medio-contacto.dto';
import { UpdateMedioContactoDto } from '../medio-contacto/dto/update-medio-contacto.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { PersonaService } from './persona.service';
export declare class PersonaController {
    private readonly personaService;
    constructor(personaService: PersonaService);
    create(createPersonaDto: CreatePersonaDto): import("./entities/persona.entity").Persona;
    findAll(): import("./entities/persona.entity").Persona[];
    findOne(id: string): import("./entities/persona.entity").Persona;
    update(id: string, updatePersonaDto: UpdatePersonaDto): import("./entities/persona.entity").Persona;
    remove(id: string): boolean;
    findContacts(id: string): import("../medio-contacto/entities/medio-contacto.entity").MedioContacto[];
    addContact(id: string, dto: CreateMedioContactoDto): import("../medio-contacto/entities/medio-contacto.entity").MedioContacto;
    updateContact(id: string, contactId: string, dto: UpdateMedioContactoDto): import("../medio-contacto/entities/medio-contacto.entity").MedioContacto;
    removeContact(id: string, contactId: string): boolean;
}
