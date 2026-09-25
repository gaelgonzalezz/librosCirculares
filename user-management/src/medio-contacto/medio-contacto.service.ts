import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PersonaService } from '../persona/persona.service';
import { CreateMedioContactoDto } from './dto/create-medio-contacto.dto';
import { UpdateMedioContactoDto } from './dto/update-medio-contacto.dto';

@Injectable()
export class MedioContactoService {
  constructor(private readonly personaService: PersonaService) {}

  create(createMedioContactoDto: CreateMedioContactoDto) {
    if (createMedioContactoDto.personaId === undefined) {
      throw new BadRequestException('El medio de contacto debe pertenecer a una persona');
    }
    return this.personaService.addContact(createMedioContactoDto.personaId, {
      tipo: createMedioContactoDto.tipo,
      valor: createMedioContactoDto.valor,
      esPreferido: createMedioContactoDto.esPreferido,
    });
  }

  findAll() {
    return this.personaService.findAll().flatMap((persona) => persona.listaMedioContactos);
  }

  findOne(id: number) {
    const contacto = this.findAll().find((item) => item.id === id);
    if (!contacto) {
      throw new NotFoundException('Medio de contacto no encontrado');
    }
    return contacto;
  }

  update(id: number, updateMedioContactoDto: UpdateMedioContactoDto) {
    const owner = this.personaService
      .findAll()
      .find((persona) => persona.listaMedioContactos.some((contacto) => contacto.id === id));
    if (!owner) {
      throw new NotFoundException('Medio de contacto no encontrado');
    }
    return this.personaService.updateContact(owner.id, id, updateMedioContactoDto);
  }

  remove(id: number) {
    const owner = this.personaService
      .findAll()
      .find((persona) => persona.listaMedioContactos.some((contacto) => contacto.id === id));
    if (!owner) {
      throw new NotFoundException('Medio de contacto no encontrado');
    }
    return this.personaService.removeContact(owner.id, id);
  }
}
