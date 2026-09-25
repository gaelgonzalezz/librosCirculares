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
exports.MedioContactoService = void 0;
const common_1 = require("@nestjs/common");
const persona_service_1 = require("../persona/persona.service");
let MedioContactoService = class MedioContactoService {
    personaService;
    constructor(personaService) {
        this.personaService = personaService;
    }
    create(createMedioContactoDto) {
        if (createMedioContactoDto.personaId === undefined) {
            throw new common_1.BadRequestException('El medio de contacto debe pertenecer a una persona');
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
    findOne(id) {
        const contacto = this.findAll().find((item) => item.id === id);
        if (!contacto) {
            throw new common_1.NotFoundException('Medio de contacto no encontrado');
        }
        return contacto;
    }
    update(id, updateMedioContactoDto) {
        const owner = this.personaService
            .findAll()
            .find((persona) => persona.listaMedioContactos.some((contacto) => contacto.id === id));
        if (!owner) {
            throw new common_1.NotFoundException('Medio de contacto no encontrado');
        }
        return this.personaService.updateContact(owner.id, id, updateMedioContactoDto);
    }
    remove(id) {
        const owner = this.personaService
            .findAll()
            .find((persona) => persona.listaMedioContactos.some((contacto) => contacto.id === id));
        if (!owner) {
            throw new common_1.NotFoundException('Medio de contacto no encontrado');
        }
        return this.personaService.removeContact(owner.id, id);
    }
};
exports.MedioContactoService = MedioContactoService;
exports.MedioContactoService = MedioContactoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [persona_service_1.PersonaService])
], MedioContactoService);
//# sourceMappingURL=medio-contacto.service.js.map