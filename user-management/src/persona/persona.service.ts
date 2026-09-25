import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { CreateMedioContactoDto } from '../medio-contacto/dto/create-medio-contacto.dto';
import { UpdateMedioContactoDto } from '../medio-contacto/dto/update-medio-contacto.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { MedioContacto } from '../medio-contacto/entities/medio-contacto.entity';
import { Persona } from './entities/persona.entity';

@Injectable()
export class PersonaService {
  personas: Persona[] = [];

  create(createPersonaDto: CreatePersonaDto) {
    if (!createPersonaDto.listaMedioContactos?.length) {
      throw new BadRequestException('La persona debe tener al menos un medio de contacto');
    }

    if (this.personas.some((persona) => persona.dni === createPersonaDto.dni)) {
      throw new ConflictException('El DNI ya existe');
    }

    const representante = createPersonaDto.personaContacto
      ? this.findOne(createPersonaDto.personaContacto)
      : undefined;
    const contactos = createPersonaDto.listaMedioContactos.map((contacto) =>
      this.createContact(contacto, representante?.id),
    );

    const nuevaPersona = new Persona();
    nuevaPersona.id = this.nextId(this.personas.map((persona) => persona.id));
    nuevaPersona.nombre = createPersonaDto.nombre;
    nuevaPersona.apellido = createPersonaDto.apellido;
    nuevaPersona.dni = createPersonaDto.dni;
    nuevaPersona.personaContacto = representante?.id;
    nuevaPersona.listaMedioContactos = contactos;
    nuevaPersona.comunidades = [];

    this.personas.push(nuevaPersona);
    return nuevaPersona;
  }

  findAll() {
    return this.personas;
  }

  findOne(id: number) {
    const persona = this.personas.find((item) => item.id === id);
    if (!persona) {
      throw new NotFoundException('Persona no encontrada');
    }
    return persona;
  }

  update(id: number, updatePersonaDto: UpdatePersonaDto) {
    const persona = this.findOne(id);

    if (updatePersonaDto.dni && updatePersonaDto.dni !== persona.dni) {
      if (this.personas.some((item) => item.id !== id && item.dni === updatePersonaDto.dni)) {
        throw new ConflictException('El DNI ya existe');
      }
      persona.dni = updatePersonaDto.dni;
    }
    if (updatePersonaDto.nombre !== undefined) persona.nombre = updatePersonaDto.nombre;
    if (updatePersonaDto.apellido !== undefined) persona.apellido = updatePersonaDto.apellido;

    if (updatePersonaDto.personaContacto !== undefined) {
      if (updatePersonaDto.personaContacto === id) {
        throw new BadRequestException('Una persona no puede representarse a sí misma');
      }
      const representante = this.findOne(updatePersonaDto.personaContacto);
      persona.personaContacto = representante.id;
      persona.listaMedioContactos = representante.listaMedioContactos.map((contacto) =>
        this.createContact(contacto, representante.id, persona.id),
      );
    }

    if (updatePersonaDto.listaMedioContactos !== undefined) {
      if (!updatePersonaDto.listaMedioContactos.length) {
        throw new BadRequestException('La persona debe tener al menos un medio de contacto');
      }
      persona.listaMedioContactos = updatePersonaDto.listaMedioContactos.map((contacto) =>
        this.createContact(contacto, persona.personaContacto, persona.id),
      );
    }

    return persona;
  }

  remove(id: number) {
    this.findOne(id);
    this.personas = this.personas.filter((persona) => persona.id !== id);
    return true;
  }

  findContacts(id: number) {
    return this.findOne(id).listaMedioContactos;
  }

  addContact(id: number, createMedioContactoDto: CreateMedioContactoDto) {
    const persona = this.findOne(id);
    const contacto = this.createContact(createMedioContactoDto, persona.personaContacto, id);
    persona.listaMedioContactos.push(contacto);
    return contacto;
  }

  updateContact(id: number, contactId: number, updateDto: UpdateMedioContactoDto) {
    const persona = this.findOne(id);
    const contacto = persona.listaMedioContactos.find((item) => item.id === contactId);
    if (!contacto) {
      throw new NotFoundException('Medio de contacto no encontrado');
    }

    if (updateDto.valor !== undefined) {
      this.assertUniqueContact(updateDto.valor, persona.personaContacto, id, contactId);
      contacto.valor = updateDto.valor;
    }
    if (updateDto.tipo !== undefined) contacto.tipo = updateDto.tipo;
    if (updateDto.esPreferido !== undefined) contacto.esPreferido = updateDto.esPreferido;
    return contacto;
  }

  removeContact(id: number, contactId: number) {
    const persona = this.findOne(id);
    if (!persona.listaMedioContactos.some((contacto) => contacto.id === contactId)) {
      throw new NotFoundException('Medio de contacto no encontrado');
    }
    persona.listaMedioContactos = persona.listaMedioContactos.filter(
      (contacto) => contacto.id !== contactId,
    );
    return true;
  }

  private createContact(
    dto: CreateMedioContactoDto,
    representativeId?: number,
    ownerId?: number,
  ) {
    this.assertUniqueContact(dto.valor, representativeId, ownerId);
    const contacto = new MedioContacto();
    contacto.id = this.nextId(this.personas.flatMap((persona) => persona.listaMedioContactos.map((item) => item.id)));
    contacto.tipo = dto.tipo;
    contacto.valor = dto.valor;
    contacto.esPreferido = dto.esPreferido ?? false;
    return contacto;
  }

  private assertUniqueContact(value: string, representativeId?: number, ownerId?: number, contactId?: number) {
    const duplicate = this.personas
      .filter((persona) => persona.id !== ownerId)
      .flatMap((persona) => persona.listaMedioContactos.map((contacto) => ({ persona, contacto })))
      .find(({ contacto }) => contacto.valor === value && contacto.id !== contactId);

    if (duplicate && duplicate.persona.id !== representativeId) {
      throw new ConflictException('El medio de contacto ya existe');
    }
  }

  private nextId(ids: number[]) {
    let id = 1;
    while (ids.includes(id)) id += 1;
    return id;
  }
}
