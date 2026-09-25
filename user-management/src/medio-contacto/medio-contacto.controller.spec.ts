import { Test, TestingModule } from '@nestjs/testing';
import { MedioContactoController } from './medio-contacto.controller';
import { MedioContactoService } from './medio-contacto.service';
import { PersonaService } from '../persona/persona.service';

describe('MedioContactoController', () => {
  let controller: MedioContactoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedioContactoController],
      providers: [MedioContactoService, PersonaService],
    }).compile();

    controller = module.get<MedioContactoController>(MedioContactoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
