"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComunidadService = void 0;
const common_1 = require("@nestjs/common");
const comunidad_entity_1 = require("./entities/comunidad.entity");
const persona_service_1 = require("../persona/persona.service");
let ComunidadService = class ComunidadService {
    personaService;
    comunidades = [];
    constructor(personaService) {
        this.personaService = personaService;
    }
    create(createComunidadDto) {
        if (this.comunidades.some((comunidad) => comunidad.nombre === createComunidadDto.nombre)) {
            throw new common_1.ConflictException('Ya existe una comunidad con ese nombre');
        }
        const comunidad = new comunidad_entity_1.Comunidad();
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
    findOne(id) {
        const comunidad = this.comunidades.find((item) => item.id === id);
        if (!comunidad)
            throw new common_1.NotFoundException('Comunidad no encontrada');
        return comunidad;
    }
    update(id, updateComunidadDto) {
        const comunidad = this.findOne(id);
        if (updateComunidadDto.nombre &&
            this.comunidades.some((item) => item.id !== id && item.nombre === updateComunidadDto.nombre)) {
            throw new common_1.ConflictException('Ya existe una comunidad con ese nombre');
        }
        if (updateComunidadDto.nombre !== undefined)
            comunidad.nombre = updateComunidadDto.nombre;
        return comunidad;
    }
    remove(id) {
        const comunidad = this.findOne(id);
        for (const personaId of [...comunidad.personas, ...comunidad.personasInactivas]) {
            const persona = this.personaService.findOne(personaId);
            persona.comunidades = persona.comunidades.filter((comunidadId) => comunidadId !== id);
        }
        this.comunidades = this.comunidades.filter((item) => item.id !== id);
        return true;
    }
    addPersona(id, personaId) {
        const comunidad = this.findOne(id);
        const persona = this.personaService.findOne(personaId);
        if (comunidad.personas.includes(personaId))
            return comunidad;
        const comunidadesActivas = persona.comunidades.filter((comunidadId) => this.findOne(comunidadId).personas.includes(personaId));
        if (comunidadesActivas.length >= 3) {
            const comunidadInactiva = persona.comunidades.find((comunidadId) => this.findOne(comunidadId).personasInactivas.includes(personaId));
            if (comunidadInactiva === undefined || comunidadInactiva === id) {
                throw new common_1.BadRequestException('Una persona no puede estar activa en más de tres comunidades');
            }
            const comunidadAnterior = this.findOne(comunidadInactiva);
            comunidadAnterior.personasInactivas = comunidadAnterior.personasInactivas.filter((item) => item !== personaId);
            persona.comunidades = persona.comunidades.filter((item) => item !== comunidadInactiva);
        }
        if (comunidad.personasInactivas.includes(personaId)) {
            comunidad.personasInactivas = comunidad.personasInactivas.filter((item) => item !== personaId);
        }
        comunidad.personas.push(personaId);
        if (!persona.comunidades.includes(id))
            persona.comunidades.push(id);
        return comunidad;
    }
    reactivatePersona(id, personaId) {
        const comunidad = this.findOne(id);
        const persona = this.personaService.findOne(personaId);
        if (comunidad.personas.includes(personaId)) {
            return comunidad;
        }
        if (!comunidad.personasInactivas.includes(personaId)) {
            throw new common_1.NotFoundException('La persona no está dada de baja/inactiva en la comunidad');
        }
        const comunidadesActivas = persona.comunidades.filter((comunidadId) => this.findOne(comunidadId).personas.includes(personaId));
        if (comunidadesActivas.length >= 3) {
            throw new common_1.BadRequestException('La persona ya está activa en 3 comunidades. Debe inactivarse en otra antes de darla de alta aquí.');
        }
        comunidad.personasInactivas = comunidad.personasInactivas.filter((item) => item !== personaId);
        comunidad.personas.push(personaId);
        if (!persona.comunidades.includes(id)) {
            persona.comunidades.push(id);
        }
        return comunidad;
    }
    removePersona(id, personaId, operacionesCerradas = true) {
        const comunidad = this.findOne(id);
        const persona = this.personaService.findOne(personaId);
        if (!operacionesCerradas) {
            throw new common_1.BadRequestException('La persona tiene operaciones pendientes');
        }
        if (!comunidad.personas.includes(personaId) && !comunidad.personasInactivas.includes(personaId)) {
            throw new common_1.NotFoundException('La persona no pertenece a la comunidad');
        }
        comunidad.personas = comunidad.personas.filter((item) => item !== personaId);
        comunidad.personasInactivas = comunidad.personasInactivas.filter((item) => item !== personaId);
        persona.comunidades = persona.comunidades.filter((item) => item !== id);
        return comunidad;
    }
    deactivatePersona(id, personaId, operacionesCerradas = true) {
        const comunidad = this.findOne(id);
        const persona = this.personaService.findOne(personaId);
        if (!operacionesCerradas) {
            throw new common_1.BadRequestException('La persona tiene operaciones pendientes');
        }
        if (!comunidad.personas.includes(personaId)) {
            throw new common_1.NotFoundException('La persona no está activa en la comunidad');
        }
        comunidad.personas = comunidad.personas.filter((item) => item !== personaId);
        comunidad.personasInactivas.push(personaId);
        return persona;
    }
    nextId() {
        let id = 1;
        while (this.comunidades.some((comunidad) => comunidad.id === id))
            id += 1;
        return id;
    }
};
exports.ComunidadService = ComunidadService;
exports.ComunidadService = ComunidadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [persona_service_1.PersonaService])
], ComunidadService);
//# sourceMappingURL=comunidad.service.js.map