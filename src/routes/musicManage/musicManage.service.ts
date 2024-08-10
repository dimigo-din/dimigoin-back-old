import type { Model } from "mongoose";

import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as moment from "moment-timezone";

import { ErrorHandler, MusicManageError } from "../../common/errors";
import {
  MusicList,
  MusicListDocument,
  MusicVote,
  MusicVoteDocument,
} from "../../schemas";

@Injectable()
export class MusicManageService {
  constructor(
    @InjectModel(MusicList.name)
    private musicListModel: Model<MusicListDocument>,
    @InjectModel(MusicVote.name)
    private musicVoteModel: Model<MusicVoteDocument>,
  ) {}

  async applyMusic(user: string, videoId: string) {
    const week = moment().format("yyyyww");

    try {
      const videoIdRegex = /[a-zA-Z0-9]*/;
      const videoIdCheck = videoIdRegex.exec(videoId);
      if (!videoIdCheck || videoIdCheck.length !== 1)
        throw new Error(MusicManageError.InvalidVideoId);

      const validatedVideoId = videoIdCheck[0];

      const listCheck = await this.musicListModel.find({
        week,
        videoId: validatedVideoId,
      });
      if (listCheck.length > 0)
        throw new Error(MusicManageError.AlreadyApplied);

      await new this.musicListModel({
        week,
        videoId: validatedVideoId,
        user,
      }).save();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        MusicManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "기상송 등록에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async select(user: string, videoId: string) {
    const day = moment().format("yyyyMMDD");
    const week = moment().format("yyyyww");

    try {
      const isApplied = await this.musicListModel.findOne({ week, videoId });
      if (!isApplied) await this.applyMusic(user, videoId);

      await this.musicListModel.findOneAndUpdate(
        { week, videoId },
        {
          $set: {
            selectedDate: day,
          },
        },
      );

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        MusicManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "기상송 확정에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(videoId: string) {
    const week = moment().format("yyyyww");

    try {
      const target = await this.musicListModel.findOne({ week, videoId });
      if (!target) throw new Error(MusicManageError.NotApplied);

      await this.musicVoteModel.deleteMany({ target: target._id });
      target.deleteOne();
    } catch (error) {
      console.log(error);
      ErrorHandler(
        MusicManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "기상송 삭제에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
