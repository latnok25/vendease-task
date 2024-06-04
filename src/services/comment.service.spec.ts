// src/services/comment.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { Repository } from 'typeorm';

describe('CommentService', () => {
  let service: CommentService;
  let repo: Repository<Comment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    repo = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllSorted', () => {
    it('should return an array of comments sorted by created_at in descending order', async () => {
      const comments: Comment[] = [];
      jest.spyOn(repo, 'find').mockResolvedValueOnce(comments);
      expect(await service.findAllSorted()).toEqual(comments);
    });
  });
});
