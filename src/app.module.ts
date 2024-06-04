// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Character } from './entities/character.entity';
import { Location } from './entities/location.entity';
import { Episode } from './entities/episode.entity';
import { Comment } from './entities/comment.entity';
import { CharacterController } from './controllers/characters.controller';
import { EpisodeController } from './controllers/episodes.controller';
import { CommentController } from './controllers/comments.controller';
import { CharacterService } from './services/characters.service';
import { EpisodeService } from './services/episodes.service';
import { CommentService } from './services/comments.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Character, Location, Episode, Comment],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Character, Location, Episode, Comment]),
  ],
  controllers: [CharacterController, EpisodeController, CommentController],
  providers: [CharacterService, EpisodeService, CommentService],
})
export class AppModule {}


// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
