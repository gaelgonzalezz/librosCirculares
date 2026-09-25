"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedioContactoModule = void 0;
const common_1 = require("@nestjs/common");
const persona_module_1 = require("../persona/persona.module");
const medio_contacto_controller_1 = require("./medio-contacto.controller");
const medio_contacto_service_1 = require("./medio-contacto.service");
let MedioContactoModule = class MedioContactoModule {
};
exports.MedioContactoModule = MedioContactoModule;
exports.MedioContactoModule = MedioContactoModule = __decorate([
    (0, common_1.Module)({
        imports: [persona_module_1.PersonaModule],
        controllers: [medio_contacto_controller_1.MedioContactoController],
        providers: [medio_contacto_service_1.MedioContactoService],
    })
], MedioContactoModule);
//# sourceMappingURL=medio-contacto.module.js.map