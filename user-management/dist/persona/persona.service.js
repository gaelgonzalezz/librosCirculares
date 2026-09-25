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
exports.PersonaService = void 0;
const common_1 = require("@nestjs/common");
const persona_entity_1 = require("./entities/persona.entity");
const medio_contacto_service_1 = require("../medio-contacto/medio-contacto.service");
const comunidad_service_1 = require("../comunidad/comunidad.service");
let PersonaService = class PersonaService {
    medioContactoService;
    comunidadService;
    constructor(medioContactoService, comunidadService) {
        this.medioContactoService = medioContactoService;
        this.comunidadService = comunidadService;
    }
    personas = [];
    siguienteId() {
        const ids = this.personas.map((p) => p.id);
        let id = 1;
        while (ids.includes(id)) {
            id++;
        }
        return id;
    }
    create(createPersonaDto) {
        if (this.personas.some((p) => p.dni == createPersonaDto.dni)) {
            throw new common_1.ConflictException('Ya existe una persona con ese DNI');
        }
        let responsable;
        if (createPersonaDto.personaContactoId) {
            responsable = this.findOne(createPersonaDto.personaContactoId);
        }
        const nueva = new persona_entity_1.Persona();
        nueva.id = this.siguienteId();
        nueva.nombre = createPersonaDto.nombre;
        nueva.apellido = createPersonaDto.apellido;
        nueva.dni = createPersonaDto.dni;
        nueva.listaMedioContactos = [];
        this.personas.push(nueva);
        if (responsable) {
            nueva.personaContacto = responsable;
            nueva.listaMedioContactos = responsable.listaMedioContactos;
        }
        else {
            if (!createPersonaDto.listaMedioContactos ||
                createPersonaDto.listaMedioContactos.length == 0) {
                throw new common_1.BadRequestException('La persona debe crearse con al menos un medio de contacto');
            }
            for (const medio of createPersonaDto.listaMedioContactos) {
                this.medioContactoService.createForPersona(nueva, medio);
            }
        }
        return nueva.id;
    }
    findAll() {
        return this.personas;
    }
    findOne(id) {
        const persona = this.personas.find((p) => p.id == id);
        if (!persona) {
            throw new common_1.NotFoundException();
        }
        return persona;
    }
    update(id, updatePersonaDto) {
        const persona = this.findOne(id);
        if (updatePersonaDto.dni &&
            this.personas.some((p) => p.dni == updatePersonaDto.dni && p.id != id)) {
            throw new common_1.ConflictException('Ya existe una persona con ese DNI');
        }
        if (updatePersonaDto.nombre) {
            persona.nombre = updatePersonaDto.nombre;
        }
        if (updatePersonaDto.apellido) {
            persona.apellido = updatePersonaDto.apellido;
        }
        if (updatePersonaDto.dni) {
            persona.dni = updatePersonaDto.dni;
        }
        if (updatePersonaDto.personaContactoId) {
            const responsable = this.findOne(updatePersonaDto.personaContactoId);
            if (responsable.id == persona.id) {
                throw new common_1.BadRequestException('Una persona no puede ser su propio representante');
            }
            persona.personaContacto = responsable;
            persona.listaMedioContactos = responsable.listaMedioContactos;
        }
    }
    remove(id) {
        this.findOne(id);
        this.comunidadService.quitarPersonaDeTodas(id);
        this.medioContactoService.medios = this.medioContactoService.medios.filter((m) => m.personaId != id);
        this.personas = this.personas.filter((p) => p.id != id);
        for (const persona of this.personas) {
            if (persona.personaContacto?.id == id) {
                persona.personaContacto = undefined;
            }
        }
        return true;
    }
};
exports.PersonaService = PersonaService;
exports.PersonaService = PersonaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => medio_contacto_service_1.MedioContactoService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => comunidad_service_1.ComunidadService))),
    __metadata("design:paramtypes", [medio_contacto_service_1.MedioContactoService,
        comunidad_service_1.ComunidadService])
], PersonaService);
//# sourceMappingURL=persona.service.js.map