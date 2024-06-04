// src/controllers/episode.controller.ts
import { Controller, Get, Param, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { EpisodeService } from '../services/episodes.service';
import { Episode } from '../entities/episode.entity';
import { Comment } from '../entities/comment.entity';

@Controller('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get()
  async findAllSortedByReleaseDate(): Promise<Episode[]> {
    try {
      return await this.episodeService.findAllSortedByReleaseDate();
    } catch (error) {
      throw new HttpException('Error retrieving episodes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('character/:characterId')
  async findAllByCharacter(@Param('characterId') characterId: number): Promise<Episode[]> {
    try {
      return await this.episodeService.findAllByCharacter(characterId);
    } catch (error) {
      throw new HttpException('Error retrieving episodes for character', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/comment')
  async addComment(@Param('id') id: number, @Body() commentData: Partial<Comment>): Promise<Episode> {
    try {
      return await this.episodeService.addComment(id, commentData);
    } catch (error) {
      throw new HttpException('Error adding comment to episode', HttpStatus.BAD_REQUEST);
    }
  }
}
