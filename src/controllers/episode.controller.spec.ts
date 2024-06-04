// src/controllers/episode.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EpisodeController } from './episodes.controller';
import { EpisodeService } from '../services/episodes.service';
import { Episode } from '../entities/episode.entity';
import { Comment } from '../entities/comment.entity';

describe('EpisodeController', () => {
  let controller: EpisodeController;
  let service: EpisodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpisodeController],
      providers: [
        {
          provide: EpisodeService,
          useValue: {
            findAllSortedByReleaseDate: jest.fn(),
            findAllByCharacter: jest.fn(),
            addComment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EpisodeController>(EpisodeController);
    service = module.get<EpisodeService>(EpisodeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllSortedByReleaseDate', () => {
    it('should return an array of episodes sorted by release date', async () => {
      const episodes: Episode[] = [];
      jest.spyOn(service, 'findAllSortedByReleaseDate').mockResolvedValueOnce(episodes);
      expect(await controller.findAllSortedByReleaseDate()).toEqual(episodes);
    });
  });

  describe('findAllByCharacter', () => {
    it('should return an array of episodes for a character', async () => {
      const episodes: Episode[] = [];
      jest.spyOn(service, 'findAllByCharacter').mockResolvedValueOnce(episodes);
      expect(await controller.findAllByCharacter(1)).toEqual(episodes);
    });
  });

  describe('addComment', () => {
    it('should add a comment to an episode and return the episode', async () => {
      const episode = new Episode();
      const comment = { comment: 'Great episode!', ip_address_location: '127.0.0.1' };
      jest.spyOn(service, 'addComment').mockResolvedValueOnce(episode);
      expect(await controller.addComment(1, comment)).toEqual(episode);
    });

    it('should throw an error if episode not found', async () => {
      jest.spyOn(service, 'addComment').mockRejectedValueOnce(new Error('Episode not found'));
      await expect(controller.addComment(1, { comment: 'Great episode!', ip_address_location: '127.0.0.1' })).rejects.toThrow('Error adding comment to episode');
    });
  });
});
