// src/controllers/character.controller.ts
import { Controller, Get, Post, Body, Param, Query, Put, Delete, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CharacterService } from '../services/characters.service';
import { Character, Gender, Status } from '../entities/character.entity';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  async findAll(
    @Query('sortBy') sortBy?: string,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    @Query('gender') gender?: Gender,
    @Query('status') status?: Status,
    @Query('location') location?: string,
  ): Promise<Character[]> {
    try {
      if (sortBy) {
        return await this.characterService.findAllSorted(sortBy, order);
      }
      if (gender || status || location) {
        const criteria: Partial<Character> = {};
        if (gender) criteria.gender = gender;
        if (status) criteria.status = status;
        if (location) criteria.location = { name: location } as any;  // Adjust as per your relation
        return await this.characterService.filterBy(criteria);
      }
      return await this.characterService.findAll();
    } catch (error) {
      throw new HttpException('Error retrieving characters', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Character> {
    try {
      return await this.characterService.findById(id);
    } catch (error) {
      throw new HttpException('Character not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  async create(@Body() characterData: Partial<Character>): Promise<Character> {
    try {
      return await this.characterService.create(characterData);
    } catch (error) {
      throw new HttpException('Error creating character', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() characterData: Partial<Character>): Promise<Character> {
    try {
      return await this.characterService.update(id, characterData);
    } catch (error) {
      if (error.message === 'Character not found') {
        throw new NotFoundException('Character not found');
      }
      throw new HttpException('Error updating character', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    try {
      await this.characterService.delete(id);
    } catch (error) {
      throw new HttpException('Error deleting character', HttpStatus.BAD_REQUEST);
    }
  }
}
