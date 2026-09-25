"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaService = void 0;
const common_1 = require("@nestjs/common");
const medio_contacto_entity_1 = require("../medio-contacto/entities/medio-contacto.entity");
const persona_entity_1 = require("./entities/persona.entity");
let PersonaService = class PersonaService {
    personas = [];
    create(createPersonaDto) {
        if (!createPersonaDto.listaMedioContactos?.length) {
            throw new common_1.BadRequestException('La persona debe tener al menos un medio de contacto');
        }
        if (this.personas.some((persona) => persona.dni === createPersonaDto.dni)) {
            throw new common_1.ConflictException('El DNI ya existe');
        }
        const representante = createPersonaDto.personaContacto
            ? this.findOne(createPersonaDto.personaContacto)
            : undefined;
        const contactos = createPersonaDto.listaMedioContactos.map((contacto) => this.createContact(contacto, representante?.id));
        const nuevaPersona = new persona_entity_1.Persona();
        nuevaPersona.id = this.nextId(this.personas.map((persona) => persona.id));
        nuevaPersona.nombre = createPersonaDto.nombre;
        nuevaPersona.apellido = createPersonaDto.apellido;
        nuevaPersona.dni = createPersonaDto.dni;
        nuevaPersona.personaContacto = representante?.id;
        nuevaPersona.listaMedioContactos = contactos;
        nuevaPersona.comunidades = [];
        this.personas.push(nuevaPersona);
        return nuevaPersona;
    }
    findAll() {
        return this.personas;
    }
    findOne(id) {
        const persona = this.personas.find((item) => item.id === id);
        if (!persona) {
            throw new common_1.NotFoundException('Persona no encontrada');
        }
        return persona;
    }
    update(id, updatePersonaDto) {
        const persona = this.findOne(id);
        if (updatePersonaDto.dni && updatePersonaDto.dni !== persona.dni) {
            if (this.personas.some((item) => item.id !== id && item.dni === updatePersonaDto.dni)) {
                throw new common_1.ConflictException('El DNI ya existe');
            }
            persona.dni = updatePersonaDto.dni;
        }
        if (updatePersonaDto.nombre !== undefined)
            persona.nombre = updatePersonaDto.nombre;
        if (updatePersonaDto.apellido !== undefined)
            persona.apellido = updatePersonaDto.apellido;
        if (updatePersonaDto.personaContacto !== undefined) {
            if (updatePersonaDto.personaContacto === id) {
                throw new common_1.BadRequestException('Una persona no puede representarse a sí misma');
            }
            const representante = this.findOne(updatePersonaDto.personaContacto);
            persona.personaContacto = representante.id;
            persona.listaMedioContactos = representante.listaMedioContactos.map((contacto) => this.createContact(contacto, representante.id, persona.id));
        }
        if (updatePersonaDto.listaMedioContactos !== undefined) {
            if (!updatePersonaDto.listaMedioContactos.length) {
                throw new common_1.BadRequestException('La persona debe tener al menos un medio de contacto');
            }
            persona.listaMedioContactos = updatePersonaDto.listaMedioContactos.map((contacto) => this.createContact(contacto, persona.personaContacto, persona.id));
        }
        return persona;
    }
    remove(id) {
        this.findOne(id);
        this.personas = this.personas.filter((persona) => persona.id !== id);
        return true;
    }
    findContacts(id) {
        return this.findOne(id).listaMedioContactos;
    }
    addContact(id, createMedioContactoDto) {
        const persona = this.findOne(id);
        const contacto = this.createContact(createMedioContactoDto, persona.personaContacto, id);
        persona.listaMedioContactos.push(contacto);
        return contacto;
    }
    updateContact(id, contactId, updateDto) {
        const persona = this.findOne(id);
        const contacto = persona.listaMedioContactos.find((item) => item.id === contactId);
        if (!contacto) {
            throw new common_1.NotFoundException('Medio de contacto no encontrado');
        }
        if (updateDto.valor !== undefined) {
            this.assertUniqueContact(updateDto.valor, persona.personaContacto, id, contactId);
            contacto.valor = updateDto.valor;
        }
        if (updateDto.tipo !== undefined)
            contacto.tipo = updateDto.tipo;
        if (updateDto.esPreferido !== undefined)
            contacto.esPreferido = updateDto.esPreferido;
        return contacto;
    }
    removeContact(id, contactId) {
        const persona = this.findOne(id);
        if (!persona.listaMedioContactos.some((contacto) => contacto.id === contactId)) {
            throw new common_1.NotFoundException('Medio de contacto no encontrado');
        }
        persona.listaMedioContactos = persona.listaMedioContactos.filter((contacto) => contacto.id !== contactId);
        return true;
    }
    createContact(dto, representativeId, ownerId) {
        this.assertUniqueContact(dto.valor, representativeId, ownerId);
        const contacto = new medio_contacto_entity_1.MedioContacto();
        contacto.id = this.nextId(this.personas.flatMap((persona) => persona.listaMedioContactos.map((item) => item.id)));
        contacto.tipo = dto.tipo;
        contacto.valor = dto.valor;
        contacto.esPreferido = dto.esPreferido ?? false;
        return contacto;
    }
    assertUniqueContact(value, representativeId, ownerId, contactId) {
        const duplicate = this.personas
            .filter((persona) => persona.id !== ownerId)
            .flatMap((persona) => persona.listaMedioContactos.map((contacto) => ({ persona, contacto })))
            .find(({ contacto }) => contacto.valor === value && contacto.id !== contactId);
        if (duplicate && duplicate.persona.id !== representativeId) {
            throw new common_1.ConflictException('El medio de contacto ya existe');
        }
    }
    nextId(ids) {
        let id = 1;
        while (ids.includes(id))
            id += 1;
        return id;
    }
};
exports.PersonaService = PersonaService;
exports.PersonaService = PersonaService = __decorate([
    (0, common_1.Injectable)()
], PersonaService);
//# sourceMappingURL=persona.service.js.map