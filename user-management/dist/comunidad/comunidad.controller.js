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
exports.ComunidadController = void 0;
const common_1 = require("@nestjs/common");
const comunidad_service_1 = require("./comunidad.service");
const create_comunidad_dto_1 = require("./dto/create-comunidad.dto");
const update_comunidad_dto_1 = require("./dto/update-comunidad.dto");
let ComunidadController = class ComunidadController {
    comunidadService;
    constructor(comunidadService) {
        this.comunidadService = comunidadService;
    }
    create(createComunidadDto) {
        return this.comunidadService.create(createComunidadDto);
    }
    findAll() {
        return this.comunidadService.findAll();
    }
    findOne(id) {
        return this.comunidadService.findOne(+id);
    }
    update(id, updateComunidadDto) {
        return this.comunidadService.update(+id, updateComunidadDto);
    }
    remove(id) {
        return this.comunidadService.remove(+id);
    }
    altaPersona(id, personaId) {
        return this.comunidadService.altaPersona(+id, +personaId);
    }
    desactivarPersona(id, personaId) {
        return this.comunidadService.desactivarPersona(+id, +personaId);
    }
    bajaPersona(id, personaId) {
        return this.comunidadService.bajaPersona(+id, +personaId);
    }
};
exports.ComunidadController = ComunidadController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comunidad_dto_1.CreateComunidadDto]),
    __metadata("design:returntype", void 0)
], ComunidadController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ComunidadController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComunidadController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_comunidad_dto_1.UpdateComunidadDto]),
    __metadata("design:returntype", void 0)
], ComunidadController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComunidadController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/personas/:personaId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('personaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ComunidadController.prototype, "altaPersona", null);
__decorate([
    (0, common_1.Patch)(':id/personas/:personaId/desactivar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('personaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ComunidadController.prototype, "desactivarPersona", null);
__decorate([
    (0, common_1.Delete)(':id/personas/:personaId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('personaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ComunidadController.prototype, "bajaPersona", null);
exports.ComunidadController = ComunidadController = __decorate([
    (0, common_1.Controller)('comunidad'),
    __metadata("design:paramtypes", [comunidad_service_1.ComunidadService])
], ComunidadController);
//# sourceMappingURL=comunidad.controller.js.map