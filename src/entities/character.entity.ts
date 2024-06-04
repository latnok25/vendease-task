import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsEnum, IsDate } from 'class-validator';
import { Location } from './location.entity';
import { Episode } from './episode.entity';

export enum Status {
  ACTIVE = 'ACTIVE',
  DEAD = 'DEAD',
  UNKNOWN = 'UNKNOWN',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @Column()
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @Column()
  @IsNotEmpty()
  @IsString()
  state_of_origin: string;

  @Column()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ManyToOne(() => Location, (location) => location.characters)
  location: Location;

  @ManyToMany(() => Episode, (episode) => episode.characters)
  @JoinTable()
  episodes: Episode[];

  @CreateDateColumn()
  @IsNotEmpty()
  @IsDate()
  created_at: Date;
}
