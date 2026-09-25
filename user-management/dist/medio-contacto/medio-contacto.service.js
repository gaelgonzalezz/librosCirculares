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
exports.MedioContactoService = void 0;
const common_1 = require("@nestjs/common");
const medio_contacto_entity_1 = require("./entities/medio-contacto.entity");
const persona_service_1 = require("../persona/persona.service");
let MedioContactoService = class MedioContactoService {
    personaService;
    constructor(personaService) {
        this.personaService = personaService;
    }
    medios = [];
    siguienteId() {
        const ids = this.medios.map((m) => m.id);
        let id = 1;
        while (ids.includes(id)) {
            id++;
        }
        return id;
    }
    coincideConExistente(tipo, valor, personaId) {
        return this.medios.some((m) => m.tipo == tipo && m.valor == valor && m.personaId != personaId);
    }
    createForPersona(persona, datos) {
        const representanteId = persona.personaContacto?.id;
        const esDelResponsable = representanteId != null &&
            this.medios.some((m) => m.personaId == representanteId &&
                m.tipo == datos.tipo &&
                m.valor == datos.valor);
        if (this.coincideConExistente(datos.tipo, datos.valor, persona.id) &&
            !esDelResponsable) {
            throw new common_1.ConflictException('El medio de contacto ya existe y no es el de un responsable');
        }
        const nuevo = new medio_contacto_entity_1.MedioContacto();
        nuevo.id = this.siguienteId();
        nuevo.tipo = datos.tipo;
        nuevo.valor = datos.valor;
        nuevo.esPreferido = datos.esPreferido;
        nuevo.personaId = persona.id;
        this.medios.push(nuevo);
        persona.listaMedioContactos.push(nuevo);
        return nuevo;
    }
    create(createMedioContactoDto) {
        const persona = this.personaService.findOne(createMedioContactoDto.personaId);
        return this.createForPersona(persona, createMedioContactoDto).id;
    }
    findAll() {
        return this.medios;
    }
    findOne(id) {
        const medio = this.medios.find((m) => m.id == id);
        if (!medio) {
            throw new common_1.NotFoundException();
        }
        return medio;
    }
    update(id, updateMedioContactoDto) {
        const medio = this.findOne(id);
        const tipo = updateMedioContactoDto.tipo ?? medio.tipo;
        const valor = updateMedioContactoDto.valor ?? medio.valor;
        const persona = this.personaService.findOne(medio.personaId);
        const representanteId = persona.personaContacto?.id;
        const esDelResponsable = representanteId != null &&
            this.medios.some((m) => m.personaId == representanteId &&
                m.tipo == tipo &&
                m.valor == valor);
        if (this.medios.some((m) => m.id != id &&
            m.tipo == tipo &&
            m.valor == valor &&
            m.personaId != medio.personaId) &&
            !esDelResponsable) {
            throw new common_1.ConflictException('El medio de contacto ya existe y no es el de un responsable');
        }
        if (updateMedioContactoDto.tipo) {
            medio.tipo = updateMedioContactoDto.tipo;
        }
        if (updateMedioContactoDto.valor) {
            medio.valor = updateMedioContactoDto.valor;
        }
        if (updateMedioContactoDto.esPreferido != null) {
            medio.esPreferido = updateMedioContactoDto.esPreferido;
        }
    }
    remove(id) {
        const medio = this.findOne(id);
        const persona = this.personaService.findOne(medio.personaId);
        if (persona.personaContacto) {
            throw new common_1.BadRequestException('Los medios de contacto de una persona con representante se gestionan en el responsable');
        }
        persona.listaMedioContactos = persona.listaMedioContactos.filter((m) => m.id != id);
        this.medios = this.medios.filter((m) => m.id != id);
        return true;
    }
};
exports.MedioContactoService = MedioContactoService;
exports.MedioContactoService = MedioContactoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => persona_service_1.PersonaService))),
    __metadata("design:paramtypes", [persona_service_1.PersonaService])
], MedioContactoService);
//# sourceMappingURL=medio-contacto.service.js.map