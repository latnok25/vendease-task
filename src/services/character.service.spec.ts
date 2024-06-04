// src/services/character.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from './characters.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Character,Gender } from '../entities/character.entity';
import { Repository } from 'typeorm';

describe('CharacterService', () => {
  let service: CharacterService;
  let repo: Repository<Character>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterService,
        {
          provide: getRepositoryToken(Character),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
    repo = module.get<Repository<Character>>(getRepositoryToken(Character));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of characters', async () => {
      const characters: Character[] = [];
      jest.spyOn(repo, 'find').mockResolvedValueOnce(characters);
      expect(await service.findAll()).toEqual(characters);
    });
  });

  describe('findById', () => {
    it('should return a character', async () => {
      const character = new Character();
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(character);
      expect(await service.findById(1)).toEqual(character);
    });

    it('should throw an error if character not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findById(1)).rejects.toThrow('Character not found');
    });
  });

  describe('create', () => {
    it('should create and return a character', async () => {
      const character = new Character();
      jest.spyOn(repo, 'save').mockResolvedValueOnce(character);
      expect(await service.create(character)).toEqual(character);
    });
  });

  describe('update', () => {
    it('should update and return the character', async () => {
      const character = new Character();
      jest.spyOn(repo, 'update').mockResolvedValueOnce(null);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(character);
      expect(await service.update(1, character)).toEqual(character);
    });

    it('should throw an error if character not found', async () => {
      jest.spyOn(repo, 'update').mockResolvedValueOnce(null);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(null);
      await expect(service.update(1, new Character())).rejects.toThrow('Character not found');
    });
  });

  describe('delete', () => {
    it('should delete the character', async () => {
      jest.spyOn(repo, 'delete').mockResolvedValueOnce(null);
      await expect(service.delete(1)).resolves.toBeUndefined();
    });
  });

  describe('findAllSorted', () => {
    it('should return an array of characters sorted', async () => {
      const characters: Character[] = [];
      jest.spyOn(repo, 'find').mockResolvedValueOnce(characters);
      expect(await service.findAllSorted('first_name', 'ASC')).toEqual(characters);
    });
  });

  describe('filterBy', () => {
    it('should return an array of filtered characters', async () => {
      const characters: Character[] = [];
      jest.spyOn(repo, 'find').mockResolvedValueOnce(characters);
      expect(await service.filterBy({ gender: 'MALE' })).toEqual(characters);
    });
  });
});
