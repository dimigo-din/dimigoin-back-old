import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import {
  MusicList,
  MusicListSchema,
  MusicVote,
  MusicVoteSchema,
  User,
  UserSchema,
} from "../../schemas";

import { MusicManageController } from "./musicManage.controller";
import { MusicManageService } from "./musicManage.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: MusicList.name, schema: MusicListSchema },
      { name: MusicVote.name, schema: MusicVoteSchema },
    ]),
  ],
  controllers: [MusicManageController],
  providers: [MusicManageService],
})
export class MusicManageModule {}
