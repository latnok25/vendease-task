// src/services/episode.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EpisodeService } from './episodes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Episode } from '../entities/episode.entity';
import { Comment } from '../entities/comment.entity';
import { Repository } from 'typeorm';

describe('EpisodeService', () => {
  let service: EpisodeService;
  let commentRepository: Repository<Comment>;
  let episodeRepository: Repository<Episode>;

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
    episodeRepository = module.get<Repository<Episode>>(getRepositoryToken(Episode));
    commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllSortedByReleaseDate', () => {
    it('should return an array of episodes sorted by release date', async () => {
      const episodes: Episode[] = [];
      jest.spyOn(episodeRepository, 'find').mockResolvedValueOnce(episodes);
      expect(await service.findAllSortedByReleaseDate()).toEqual(episodes);
    });
  });

  describe('findAllByCharacter', () => {
    it('should return an array of episodes for a character', async () => {
      const episodes: Episode[] = [];
      jest.spyOn(episodeRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(episodes),
      } as any);
      expect(await service.findAllByCharacter(1)).toEqual(episodes);
    });
  });

//   describe('addComment', () => {
//     it('should add a comment to an episode and return the episode', async () => {
//       const episode = new Episode();
//       episode.id = 1;
//       episode.episodeComments = [];

//       const commentData = { comment: 'Great episode!' };

//       jest.spyOn(episodeRepository, 'findOne').mockResolvedValue(episode);
//       jest.spyOn(commentRepository, 'create').mockReturnValue(commentData as Comment);
//       jest.spyOn(commentRepository, 'save').mockResolvedValue(commentData as Comment);
//       jest.spyOn(episodeRepository, 'save').mockResolvedValue(episode);

//       const result = await service.addComment(1, commentData);

//       expect(result).toEqual(episode);
//       expect(commentRepository.create).toHaveBeenCalledWith(commentData);
//       expect(commentRepository.save).toHaveBeenCalledWith(commentData as Comment);
//       expect(episodeRepository.save).toHaveBeenCalledWith(episode);
//     });
//   });

  describe('addComment', () => {
    it('should add a comment to an episode and return the episode', async () => {
      const episode = new Episode();
      episode.id = 1;
      episode.episodeComments = [];

      const commentData: Partial<Comment> = { comment: 'Great episode!', ip_address_location: '127.0.0.1', created_at: new Date() };
      const comment = new Comment();
      Object.assign(comment, commentData);

      jest.spyOn(episodeRepository, 'findOne').mockResolvedValue(episode);
      jest.spyOn(commentRepository, 'create').mockReturnValue(comment);
      jest.spyOn(commentRepository, 'save').mockResolvedValue(comment);

      const result = await service.addComment(1, commentData);

      expect(result).toEqual(episode);
      expect(episodeRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['episodeComments'] });
      expect(commentRepository.create).toHaveBeenCalledWith(commentData);
      expect(commentRepository.save).toHaveBeenCalledWith(comment);
    });
  });
});
