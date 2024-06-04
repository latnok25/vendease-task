// src/controllers/comment.controller.ts
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { CommentService } from '../services/comments.service';
import { Comment } from '../entities/comment.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async findAllSorted(): Promise<Comment[]> {
    try {
      return await this.commentService.findAllSorted();
    } catch (error) {
      throw new HttpException('Error retrieving comments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
