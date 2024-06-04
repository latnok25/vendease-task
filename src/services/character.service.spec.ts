// src/services/character.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from './characters.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Character,Gender,Status } from '../entities/character.entity';
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
      const characterData = { first_name: 'John', last_name: 'Doe', status: Status.ACTIVE, state_of_origin: 'Texas', gender: Gender.MALE };
      const savedCharacter = { ...characterData, id: 1, created_at: new Date() };

      jest.spyOn(repo, 'create').mockReturnValue(characterData as Character);
      jest.spyOn(repo, 'save').mockResolvedValue(savedCharacter as Character);

      const result = await service.create(characterData);

      expect(result).toEqual(savedCharacter);
      expect(repo.create).toHaveBeenCalledWith(characterData);
      expect(repo.save).toHaveBeenCalledWith(characterData as Character);
    });
  });

  describe('update', () => {
    it('should update and return the character', async () => {
      const characterData = { first_name: 'John', last_name: 'Doe', status: Status.ACTIVE, state_of_origin: 'Texas', gender: Gender.MALE };
      const existingCharacter = { ...characterData, id: 1, created_at: new Date() }as Character;

      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(existingCharacter as Character);
      jest.spyOn(repo, 'save').mockResolvedValueOnce({ ...existingCharacter, ...characterData });

      const result = await service.update(1, characterData);

      expect(result).toEqual({ ...existingCharacter, ...characterData });
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['location', 'episodes'] });
      expect(repo.save).toHaveBeenCalledWith({ ...existingCharacter, ...characterData });
    });

    it('should throw an error if character not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);

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
      expect(await service.filterBy({ gender: Gender.MALE })).toEqual(characters);
    });
  });
});
