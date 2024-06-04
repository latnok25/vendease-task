// src/services/episode.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from '../entities/episode.entity';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectRepository(Episode)
    private episodesRepository: Repository<Episode>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findAllSortedByReleaseDate(): Promise<Episode[]> {
    return this.episodesRepository.find({
      order: { release_date: 'ASC' },
      relations: ['episodeComments'],
    });
  }

  async findAllByCharacter(characterId: number): Promise<Episode[]> {
    return this.episodesRepository.createQueryBuilder('episode')
      .leftJoinAndSelect('episode.characters', 'character')
      .where('character.id = :characterId', { characterId })
      .getMany();
  }

//   async addComment(episodeId: number, commentData: Partial<Comment>): Promise<Episode> {
//     const episode = await this.episodesRepository.findOne({
//       where: { id: episodeId },
//       relations: ['episodeComments'],
//     });

//     if (!episode) {
//       throw new NotFoundException('Episode not found');
//     }

//     const comment = this.commentRepository.create(commentData);
//     comment.episode = episode;
//     await this.commentRepository.save(comment);

//     // Reload the episode to include the newly added comment
//     return this.episodesRepository.findOne({
//       where: { id: episodeId },
//       relations: ['episodeComments'],
//     });

    
//   }

  async addComment(episodeId: number, commentData: Partial<Comment>): Promise<Episode> {
    const episode = await this.episodesRepository.findOne({
      where: { id: episodeId },
      relations: ['episodeComments'],
    });

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }

    const comment = this.commentRepository.create(commentData);
    await this.commentRepository.save(comment);
    episode.episodeComments.push(comment);
    return episode;
  }
}
