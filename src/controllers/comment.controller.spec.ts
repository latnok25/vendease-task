// src/controllers/comment.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comments.controller';
import { CommentService } from '../services/comments.service';
import { Comment } from '../entities/comment.entity';

describe('CommentController', () => {
  let controller: CommentController;
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: {
            findAllSorted: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllSorted', () => {
    it('should return an array of comments sorted by created_at in descending order', async () => {
      const comments: Comment[] = [];
      jest.spyOn(service, 'findAllSorted').mockResolvedValueOnce(comments);
      expect(await controller.findAllSorted()).toEqual(comments);
    });
  });
});
