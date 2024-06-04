import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, CreateDateColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';
import { Character } from './character.entity';
import { Comment } from './comment.entity';

@Entity()
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsDate()
  release_date: Date;

  @Column()
  @IsNotEmpty()
  @IsString()
  episode_code: string;

  @ManyToMany(() => Character, (character) => character.episodes)
  characters: Character[];

  @OneToMany(() => Comment, (comment) => comment.episode)
  episodeComments: Comment[];

  @CreateDateColumn()
  @IsNotEmpty()
  @IsDate()
  created_at: Date;
}
