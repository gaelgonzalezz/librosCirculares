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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComunidadService = void 0;
const common_1 = require("@nestjs/common");
const comunidad_entity_1 = require("./entities/comunidad.entity");
const persona_service_1 = require("../persona/persona.service");
let ComunidadService = class ComunidadService {
    personaService;
    constructor(personaService) {
        this.personaService = personaService;
    }
    comunidades = [];
    siguienteId() {
        const ids = this.comunidades.map((c) => c.id);
        let id = 1;
        while (ids.includes(id)) {
            id++;
        }
        return id;
    }
    create(createComunidadDto) {
        if (this.comunidades.some((c) => c.nombre == createComunidadDto.nombre)) {
            throw new common_1.ConflictException('Solicitar un nombre distinto de comunidad');
        }
        const nueva = new comunidad_entity_1.Comunidad();
        nueva.id = this.siguienteId();
        nueva.nombre = createComunidadDto.nombre;
        nueva.personas = [];
        nueva.idsPersonasInactivas = [];
        this.comunidades.push(nueva);
        return nueva.id;
    }
    findAll() {
        return this.comunidades;
    }
    findOne(id) {
        const comunidad = this.comunidades.find((c) => c.id == id);
        if (!comunidad) {
            throw new common_1.NotFoundException();
        }
        return comunidad;
    }
    update(id, updateComunidadDto) {
        const comunidad = this.findOne(id);
        if (updateComunidadDto.nombre &&
            this.comunidades.some((c) => c.nombre == updateComunidadDto.nombre && c.id != id)) {
            throw new common_1.ConflictException('Solicitar un nombre distinto de comunidad');
        }
        if (updateComunidadDto.nombre) {
            comunidad.nombre = updateComunidadDto.nombre;
        }
    }
    remove(id) {
        this.findOne(id);
        this.comunidades = this.comunidades.filter((c) => c.id != id);
        return true;
    }
    estaAfiliada(comunidad, personaId) {
        return comunidad.personas.some((p) => p.id == personaId);
    }
    estaActiva(comunidad, personaId) {
        return (this.estaAfiliada(comunidad, personaId) &&
            !comunidad.idsPersonasInactivas.includes(personaId));
    }
    comunidadesDe(personaId) {
        return this.comunidades.filter((c) => this.estaAfiliada(c, personaId));
    }
    comunidadesActivasDe(personaId) {
        return this.comunidades.filter((c) => this.estaActiva(c, personaId));
    }
    async operacionesCerradas(idPersona, idComunidad) {
        const base = process.env.OPERATION_MANAGEMENT_URL ?? 'http://localhost:3001';
        const url = `${base}/persona/idPersona/${idPersona}/operacionesCerradas?idComunidad=${idComunidad}`;
        try {
            const respuesta = await fetch(url);
            if (!respuesta.ok) {
                throw new Error();
            }
            const data = await respuesta.json();
            return data === true || data?.operacionesCerradas === true;
        }
        catch {
            throw new common_1.BadRequestException('No se pudo verificar si las operaciones estan cerradas');
        }
    }
    async altaPersona(idComunidad, idPersona) {
        const comunidad = this.findOne(idComunidad);
        const persona = this.personaService.findOne(idPersona);
        if (this.estaAfiliada(comunidad, idPersona)) {
            throw new common_1.ConflictException('La persona ya esta afiliada a la comunidad');
        }
        const activas = this.comunidadesActivasDe(idPersona);
        if (activas.length >= 3) {
            throw new common_1.BadRequestException('La persona ya esta activa en 3 comunidades');
        }
        const inactivas = this.comunidadesDe(idPersona).filter((c) => !this.estaActiva(c, idPersona));
        if (activas.length + inactivas.length >= 3 && inactivas.length > 0) {
            const aDarDeBaja = inactivas[0];
            await this.bajaPersona(aDarDeBaja.id, idPersona);
        }
        comunidad.personas.push(persona);
    }
    async bajaPersona(idComunidad, idPersona) {
        const comunidad = this.findOne(idComunidad);
        this.personaService.findOne(idPersona);
        if (!this.estaAfiliada(comunidad, idPersona)) {
            throw new common_1.NotFoundException();
        }
        const cerradas = await this.operacionesCerradas(idPersona, idComunidad);
        if (!cerradas) {
            throw new common_1.BadRequestException('La persona tiene operaciones en curso en la comunidad');
        }
        comunidad.personas = comunidad.personas.filter((p) => p.id != idPersona);
        comunidad.idsPersonasInactivas = comunidad.idsPersonasInactivas.filter((id) => id != idPersona);
        return true;
    }
    async desactivarPersona(idComunidad, idPersona) {
        const comunidad = this.findOne(idComunidad);
        this.personaService.findOne(idPersona);
        if (!this.estaAfiliada(comunidad, idPersona)) {
            throw new common_1.NotFoundException();
        }
        const cerradas = await this.operacionesCerradas(idPersona, idComunidad);
        if (!cerradas) {
            throw new common_1.BadRequestException('La persona tiene operaciones en curso en la comunidad');
        }
        if (!comunidad.idsPersonasInactivas.includes(idPersona)) {
            comunidad.idsPersonasInactivas.push(idPersona);
        }
        return true;
    }
    quitarPersonaDeTodas(idPersona) {
        for (const comunidad of this.comunidades) {
            comunidad.personas = comunidad.personas.filter((p) => p.id != idPersona);
            comunidad.idsPersonasInactivas = comunidad.idsPersonasInactivas.filter((id) => id != idPersona);
        }
    }
};
exports.ComunidadService = ComunidadService;
exports.ComunidadService = ComunidadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => persona_service_1.PersonaService))),
    __metadata("design:paramtypes", [persona_service_1.PersonaService])
], ComunidadService);
//# sourceMappingURL=comunidad.service.js.map