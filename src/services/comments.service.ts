// src/services/comment.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({ relations: ['episode'] });
  }

  async findAllSorted(): Promise<Comment[]> {
    return this.commentRepository.find({
      order: { created_at: 'DESC' },
      relations: ['episode'],
    });
  }
}
