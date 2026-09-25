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
exports.MedioContactoController = void 0;
const common_1 = require("@nestjs/common");
const create_medio_contacto_dto_1 = require("./dto/create-medio-contacto.dto");
const update_medio_contacto_dto_1 = require("./dto/update-medio-contacto.dto");
const medio_contacto_service_1 = require("./medio-contacto.service");
let MedioContactoController = class MedioContactoController {
    medioContactoService;
    constructor(medioContactoService) {
        this.medioContactoService = medioContactoService;
    }
    create(dto) {
        return this.medioContactoService.create(dto);
    }
    findAll() {
        return this.medioContactoService.findAll();
    }
    findOne(id) {
        return this.medioContactoService.findOne(+id);
    }
    update(id, dto) {
        return this.medioContactoService.update(+id, dto);
    }
    remove(id) {
        return this.medioContactoService.remove(+id);
    }
};
exports.MedioContactoController = MedioContactoController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_medio_contacto_dto_1.CreateMedioContactoDto]),
    __metadata("design:returntype", void 0)
], MedioContactoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MedioContactoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MedioContactoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_medio_contacto_dto_1.UpdateMedioContactoDto]),
    __metadata("design:returntype", void 0)
], MedioContactoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MedioContactoController.prototype, "remove", null);
exports.MedioContactoController = MedioContactoController = __decorate([
    (0, common_1.Controller)('medioContacto'),
    __metadata("design:paramtypes", [medio_contacto_service_1.MedioContactoService])
], MedioContactoController);
//# sourceMappingURL=medio-contacto.controller.js.map