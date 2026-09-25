import { CreatePersonaDto } from './dto/create-persona.dto';
import { CreateMedioContactoDto } from '../medio-contacto/dto/create-medio-contacto.dto';
import { UpdateMedioContactoDto } from '../medio-contacto/dto/update-medio-contacto.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { MedioContacto } from '../medio-contacto/entities/medio-contacto.entity';
import { Persona } from './entities/persona.entity';
export declare class PersonaService {
    personas: Persona[];
    create(createPersonaDto: CreatePersonaDto): Persona;
    findAll(): Persona[];
    findOne(id: number): Persona;
    update(id: number, updatePersonaDto: UpdatePersonaDto): Persona;
    remove(id: number): boolean;
    findContacts(id: number): MedioContacto[];
    addContact(id: number, createMedioContactoDto: CreateMedioContactoDto): MedioContacto;
    updateContact(id: number, contactId: number, updateDto: UpdateMedioContactoDto): MedioContacto;
    removeContact(id: number, contactId: number): boolean;
    private createContact;
    private assertUniqueContact;
    private nextId;
}
