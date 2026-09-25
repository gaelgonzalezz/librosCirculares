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
exports.OperacionController = void 0;
const common_1 = require("@nestjs/common");
const operacion_service_1 = require("./operacion.service");
const create_prestamo_dto_1 = require("./dto/create-prestamo.dto");
const create_devolucion_dto_1 = require("./dto/create-devolucion.dto");
const create_cesion_dto_1 = require("./dto/create-cesion.dto");
const create_baja_dto_1 = require("./dto/create-baja.dto");
let OperacionController = class OperacionController {
    operacionService;
    constructor(operacionService) {
        this.operacionService = operacionService;
    }
    createPrestamo(dto) {
        return this.operacionService.registrarPrestamo(dto);
    }
    createDevolucion(dto) {
        return this.operacionService.registrarDevolucion(dto);
    }
    createCesion(dto) {
        return this.operacionService.registrarCesion(dto);
    }
    createBaja(dto) {
        return this.operacionService.registrarBaja(dto);
    }
    findAll(ejemplarId, personaId, tipo, estado) {
        return this.operacionService.findAll({
            ejemplarId: ejemplarId ? +ejemplarId : undefined,
            personaId: personaId ? +personaId : undefined,
            tipo: tipo,
            estado: estado,
        });
    }
    findOne(id) {
        return this.operacionService.findOne(+id);
    }
    consultarPersonas(id, idComunidad) {
        return this.operacionService.consultarPersona(+id, +idComunidad);
    }
};
exports.OperacionController = OperacionController;
__decorate([
    (0, common_1.Post)('operaciones/prestamo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_prestamo_dto_1.CreatePrestamoDto]),
    __metadata("design:returntype", void 0)
], OperacionController.prototype, "createPrestamo", null);
__decorate([
    (0, common_1.Post)('operaciones/devolucion'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_devolucion_dto_1.CreateDevolucionDto]),
    __metadata("design:returntype", void 0)
], OperacionController.prototype, "createDevolucion", null);
__decorate([
    (0, common_1.Post)('operaciones/cesion'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cesion_dto_1.CreateCesionDto]),
    __metadata("design:returntype", void 0)
], OperacionController.prototype, "createCesion", null);
__decorate([
    (0, common_1.Post)('operaciones/baja'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_baja_dto_1.CreateBajaDto]),
    __metadata("design:returntype", void 0)
], OperacionController.prototype, "createBaja", null);
__decorate([
    (0, common_1.Get)('operaciones'),
    __param(0, (0, common_1.Query)('ejemplarId')),
    __param(1, (0, common_1.Query)('personaId')),
    __param(2, (0, common_1.Query)('tipo')),
    __param(3, (0, common_1.Query)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], OperacionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('operaciones/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OperacionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('personas/:id/operaciones'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('idComunidad')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OperacionController.prototype, "consultarPersonas", null);
exports.OperacionController = OperacionController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [operacion_service_1.OperacionService])
], OperacionController);
//# sourceMappingURL=operacion.controller.js.map