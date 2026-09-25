import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateComunidadDto } from './dto/create-comunidad.dto';
import { UpdateComunidadDto } from './dto/update-comunidad.dto';
import { Comunidad } from './entities/comunidad.entity';
import { PersonaService } from '../persona/persona.service';

@Injectable()
export class ComunidadService {
  comunidades: Comunidad[] = [];

  constructor(private readonly personaService: PersonaService) {}

  create(createComunidadDto: CreateComunidadDto) {
    if (this.comunidades.some((comunidad) => comunidad.nombre === createComunidadDto.nombre)) {
      throw new ConflictException('Ya existe una comunidad con ese nombre');
    }
    const comunidad = new Comunidad();
    comunidad.id = this.nextId();
    comunidad.nombre = createComunidadDto.nombre;
    comunidad.personas = [];
    comunidad.personasInactivas = [];
    this.comunidades.push(comunidad);
    return comunidad;
  }

  findAll() {
    return this.comunidades;
  }

  findOne(id: number) {
    const comunidad = this.comunidades.find((item) => item.id === id);
    if (!comunidad) throw new NotFoundException('Comunidad no encontrada');
    return comunidad;
  }

  update(id: number, updateComunidadDto: UpdateComunidadDto) {
    const comunidad = this.findOne(id);
    if (
      updateComunidadDto.nombre &&
      this.comunidades.some(
        (item) => item.id !== id && item.nombre === updateComunidadDto.nombre,
      )
    ) {
      throw new ConflictException('Ya existe una comunidad con ese nombre');
    }
    if (updateComunidadDto.nombre !== undefined) comunidad.nombre = updateComunidadDto.nombre;
    return comunidad;
  }

  remove(id: number) {
    const comunidad = this.findOne(id);
    for (const personaId of [...comunidad.personas, ...comunidad.personasInactivas]) {
      const persona = this.personaService.findOne(personaId);
      persona.comunidades = persona.comunidades.filter((comunidadId) => comunidadId !== id);
    }
    this.comunidades = this.comunidades.filter((item) => item.id !== id);
    return true;
  }

  addPersona(id: number, personaId: number) {
    const comunidad = this.findOne(id);
    const persona = this.personaService.findOne(personaId);

    if (comunidad.personas.includes(personaId)) return comunidad;

    const comunidadesActivas = persona.comunidades.filter((comunidadId) =>
      this.findOne(comunidadId).personas.includes(personaId),
    );
    if (comunidadesActivas.length >= 3) {
      const comunidadInactiva = persona.comunidades.find((comunidadId) =>
        this.findOne(comunidadId).personasInactivas.includes(personaId),
      );
      if (comunidadInactiva === undefined || comunidadInactiva === id) {
        throw new BadRequestException('Una persona no puede estar activa en más de tres comunidades');
      }
      const comunidadAnterior = this.findOne(comunidadInactiva);
      comunidadAnterior.personasInactivas = comunidadAnterior.personasInactivas.filter(
        (item) => item !== personaId,
      );
      persona.comunidades = persona.comunidades.filter((item) => item !== comunidadInactiva);
    }

    if (comunidad.personasInactivas.includes(personaId)) {
      comunidad.personasInactivas = comunidad.personasInactivas.filter((item) => item !== personaId);
    }

    comunidad.personas.push(personaId);
    if (!persona.comunidades.includes(id)) persona.comunidades.push(id);
    return comunidad;
  }

  removePersona(id: number, personaId: number, operacionesCerradas = true) {
    const comunidad = this.findOne(id);
    const persona = this.personaService.findOne(personaId);
    if (!operacionesCerradas) {
      throw new BadRequestException('La persona tiene operaciones pendientes');
    }
    if (!comunidad.personas.includes(personaId) && !comunidad.personasInactivas.includes(personaId)) {
      throw new NotFoundException('La persona no pertenece a la comunidad');
    }
    comunidad.personas = comunidad.personas.filter((item) => item !== personaId);
    comunidad.personasInactivas = comunidad.personasInactivas.filter((item) => item !== personaId);
    persona.comunidades = persona.comunidades.filter((item) => item !== id);
    return comunidad;
  }

  deactivatePersona(id: number, personaId: number, operacionesCerradas = true) {
    const comunidad = this.findOne(id);
    const persona = this.personaService.findOne(personaId);
    if (!operacionesCerradas) {
      throw new BadRequestException('La persona tiene operaciones pendientes');
    }
    if (!comunidad.personas.includes(personaId)) {
      throw new NotFoundException('La persona no está activa en la comunidad');
    }
    comunidad.personas = comunidad.personas.filter((item) => item !== personaId);
    comunidad.personasInactivas.push(personaId);
    return persona;
  }

  private nextId() {
    let id = 1;
    while (this.comunidades.some((comunidad) => comunidad.id === id)) id += 1;
    return id;
  }
}
