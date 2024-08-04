import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import {
  MusicList,
  MusicListSchema,
  MusicVote,
  MusicVoteSchema,
  RateLimit,
  RateLimitSchema,
  User,
  UserSchema,
} from "../../schemas";

import { MusicController } from "./music.controller";
import { MusicService } from "./music.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: MusicList.name, schema: MusicListSchema },
      { name: MusicVote.name, schema: MusicVoteSchema },
      { name: RateLimit.name, schema: RateLimitSchema },
    ]),
  ],
  controllers: [MusicController],
  providers: [MusicService],
})
export class MusicModule {}
