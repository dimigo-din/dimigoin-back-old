import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { RateLimit, RateLimitSchema } from "../../schemas/ratelimit.schema";

import { MusicController } from "./music.controller";
import { MusicService } from "./music.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RateLimit.name, schema: RateLimitSchema },
    ]),
  ],
  controllers: [MusicController],
  providers: [MusicService],
})
export class MusicModule {}
