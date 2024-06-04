// src/services/character.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from '../entities/character.entity';
import { Location } from '../entities/location.entity';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private characterRepository: Repository<Character>,
  ) {}

  async findAll(): Promise<Character[]> {
    return this.characterRepository.find({ relations: ['location', 'episodes'] });
  }

  async findById(id: number): Promise<Character> {
    const character = await this.characterRepository.findOne({
      where: { id },
      relations: ['location', 'episodes'],
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    return character;
  }

  async create(characterData: Partial<Character>): Promise<Character> {
    const character = this.characterRepository.create(characterData);
    return this.characterRepository.save(character);
  }

  async update(id: number, characterData: Partial<Character>): Promise<Character> {
    await this.characterRepository.update(id, characterData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.characterRepository.delete(id);
  }

  async findAllSorted(sortBy: string, order: 'ASC' | 'DESC'): Promise<Character[]> {
    return this.characterRepository.find({
      order: { [sortBy]: order },
      relations: ['location', 'episodes'],
    });
  }

  async filterBy(criteria: Partial<Character>): Promise<Character[]> {
    return this.characterRepository.find({
      where: criteria,
      relations: ['location', 'episodes'],
    });
  }
}
