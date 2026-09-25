import { Test, TestingModule } from '@nestjs/testing';
import { MedioContactoService } from './medio-contacto.service';
import { PersonaService } from '../persona/persona.service';

describe('MedioContactoService', () => {
  let service: MedioContactoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedioContactoService, PersonaService],
    }).compile();

    service = module.get<MedioContactoService>(MedioContactoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
