// src/services/episode.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EpisodeService } from './episodes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Episode } from '../entities/episode.entity';
import { Comment } from '../entities/comment.entity';
import { Repository } from 'typeorm';

describe('EpisodeService', () => {
  let service: EpisodeService;
  let repo: Repository<Episode>;
  let commentRepo: Repository<Comment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EpisodeService,
        {
          provide: getRepositoryToken(Episode),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Comment),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<EpisodeService>(EpisodeService);
    repo = module.get<Repository<Episode>>(getRepositoryToken(Episode));
    commentRepo = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllSortedByReleaseDate', () => {
    it('should return an array of episodes sorted by release date', async () => {
      const episodes: Episode[] = [];
      jest.spyOn(repo, 'find').mockResolvedValueOnce(episodes);
      expect(await service.findAllSortedByReleaseDate()).toEqual(episodes);
    });
  });

  describe('findAllByCharacter', () => {
    it('should return an array of episodes for a character', async () => {
      const episodes: Episode[] = [];
      jest.spyOn(repo, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(episodes),
      } as any);
      expect(await service.findAllByCharacter(1)).toEqual(episodes);
    });
  });

  describe('addComment', () => {
    it('should add a comment to an episode and return the episode', async () => {
      const episode = new Episode();
      episode.episodeComments = [];
      const comment = new Comment();
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(episode);
      jest.spyOn(commentRepo, 'save').mockResolvedValueOnce(comment);
      expect(await service.addComment(1 , { comment: 'Great episode!', ip_address_location: '127.0.0.1' })).toEqual(episode);
    });

    it('should throw an error if episode not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.addComment(1, { comment: 'Great episode!', ip_address_location: '127.0.0.1' })).rejects.toThrow('Episode not found');
    });
  });
});

