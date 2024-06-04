import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';

@Controller('locations')
export class LocationsController {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  @Get()
  async findAll(): Promise<Location[]> {
    return this.locationsRepository.find();
  }

  @Post()
  async create(@Body() location: Location): Promise<Location> {
    return this.locationsRepository.save(location);
  }
}
