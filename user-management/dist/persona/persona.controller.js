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
exports.PersonaController = void 0;
const common_1 = require("@nestjs/common");
const create_persona_dto_1 = require("./dto/create-persona.dto");
const create_medio_contacto_dto_1 = require("../medio-contacto/dto/create-medio-contacto.dto");
const update_medio_contacto_dto_1 = require("../medio-contacto/dto/update-medio-contacto.dto");
const update_persona_dto_1 = require("./dto/update-persona.dto");
const persona_service_1 = require("./persona.service");
let PersonaController = class PersonaController {
    personaService;
    constructor(personaService) {
        this.personaService = personaService;
    }
    create(createPersonaDto) {
        return this.personaService.create(createPersonaDto);
    }
    findAll() {
        return this.personaService.findAll();
    }
    findOne(id) {
        return this.personaService.findOne(+id);
    }
    update(id, updatePersonaDto) {
        return this.personaService.update(+id, updatePersonaDto);
    }
    remove(id) {
        return this.personaService.remove(+id);
    }
    findContacts(id) {
        return this.personaService.findContacts(+id);
    }
    addContact(id, dto) {
        return this.personaService.addContact(+id, dto);
    }
    updateContact(id, contactId, dto) {
        return this.personaService.updateContact(+id, +contactId, dto);
    }
    removeContact(id, contactId) {
        return this.personaService.removeContact(+id, +contactId);
    }
};
exports.PersonaController = PersonaController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_persona_dto_1.CreatePersonaDto]),
    __metadata("design:returntype", void 0)
], PersonaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PersonaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_persona_dto_1.UpdatePersonaDto]),
    __metadata("design:returntype", void 0)
], PersonaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonaController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/contacto'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonaController.prototype, "findContacts", null);
__decorate([
    (0, common_1.Post)(':id/contacto'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_medio_contacto_dto_1.CreateMedioContactoDto]),
    __metadata("design:returntype", void 0)
], PersonaController.prototype, "addContact", null);
__decorate([
    (0, common_1.Patch)(':id/contacto/:contactId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('contactId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_medio_contacto_dto_1.UpdateMedioContactoDto]),
    __metadata("design:returntype", void 0)
], PersonaController.prototype, "updateContact", null);
__decorate([
    (0, common_1.Delete)(':id/contacto/:contactId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('contactId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PersonaController.prototype, "removeContact", null);
exports.PersonaController = PersonaController = __decorate([
    (0, common_1.Controller)('persona'),
    __metadata("design:paramtypes", [persona_service_1.PersonaService])
], PersonaController);
//# sourceMappingURL=persona.controller.js.map