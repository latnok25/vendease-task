// src/controllers/character.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CharacterController } from './characters.controller';
import { CharacterService } from '../services/characters.service';
import { Character } from '../entities/character.entity';

describe('CharacterController', () => {
  let controller: CharacterController;
  let service: CharacterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacterController],
      providers: [
        {
          provide: CharacterService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAllSorted: jest.fn(),
            filterBy: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CharacterController>(CharacterController);
    service = module.get<CharacterService>(CharacterService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of characters', async () => {
      const characters: Character[] = [];
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(characters);
      expect(await controller.findAll()).toEqual(characters);
    });
  });

  describe('findById', () => {
    it('should return a character', async () => {
      const character = new Character();
      jest.spyOn(service, 'findById').mockResolvedValueOnce(character);
      expect(await controller.findById(1)).toEqual(character);
    });

    it('should throw an error if character not found', async () => {
      jest.spyOn(service, 'findById').mockRejectedValueOnce(new Error('Character not found'));
      await expect(controller.findById(1)).rejects.toThrow('Character not found');
    });
  });

  describe('create', () => {
    it('should create and return a character', async () => {
      const character = new Character();
      jest.spyOn(service, 'create').mockResolvedValueOnce(character);
      expect(await controller.create(character)).toEqual(character);
    });
  });

  describe('update', () => {
    it('should update and return the character', async () => {
      const character = new Character();
      jest.spyOn(service, 'update').mockResolvedValueOnce(character);
      expect(await controller.update(1, character)).toEqual(character);
    });

    it('should throw an error if character not found', async () => {
      jest.spyOn(service, 'update').mockRejectedValueOnce(new Error('Character not found'));
      await expect(controller.update(1, new Character())).rejects.toThrow('Character not found');
    });
  });

  describe('delete', () => {
    it('should delete the character', async () => {
      jest.spyOn(service, 'delete').mockResolvedValueOnce();
      await expect(controller.delete(1)).resolves.toBeUndefined();
    });
  });
 
});
