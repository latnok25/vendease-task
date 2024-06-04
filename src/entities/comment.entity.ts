import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';
import { Episode } from './episode.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  @IsNotEmpty()
  @IsString()
  comment: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  ip_address_location: string;

  @ManyToOne(() => Episode, (episode) => episode.episodeComments, { onDelete: 'CASCADE' })
  episode: Episode;

  @CreateDateColumn()
  @IsNotEmpty()
  @IsDate()
  created_at: Date;
}
