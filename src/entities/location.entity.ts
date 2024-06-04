import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsDate, IsNumber } from 'class-validator';
import { Character } from './character.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column('double precision')
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @Column('double precision')
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @CreateDateColumn()
  @IsNotEmpty()
  @IsDate()
  created: Date;

  @OneToMany(() => Character, (character) => character.location)
  characters: Character[];
}
