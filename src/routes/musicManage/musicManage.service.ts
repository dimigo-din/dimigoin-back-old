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

  async musicList() {
    const week = moment().format("yyyyww");

    try {
      const musics = await this.musicListModel.find({
        week,
        selectedDate: null,
      });

      const votes = (
        await this.musicVoteModel.aggregate([
          { $match: { week } },
          {
            $group: {
              _id: {
                target: "$target",
                isUpVote: "$isUpVote",
              },
              count: { $sum: 1 },
            },
          },
        ])
      ).map((v) => {
        // 이놈이 votes에 최종 진화(?)
        return {
          target: v._id.target,
          isUpVote: v._id.isUpVote,
          count: v.count,
        };
      });

      return Promise.all(
        musics.map(async (m) => {
          // 음악 제목과 썸네일을 가져오기 위한 api
          const musicInfo = await (
            await fetch(
              `https://www.youtube.com/oembed?url=youtube.com/watch?v=${m.videoId}`,
            )
          ).json();

          // 특정 기상송의 투표 집계
          const vote = votes.filter((v) => v.target.equals(m._id));
          const upVote = (vote.find((v) => v.isUpVote) || { count: 0 }).count;
          const downVote = (vote.find((v) => !v.isUpVote) || { count: 0 })
            .count;

          return {
            id: m.videoId,
            title: musicInfo.title,
            thumbnail: musicInfo.thumbnail_url,
            upVote,
            downVote,
          };
        }),
      );
    } catch (error) {
      console.log(error);
      ErrorHandler(
        MusicManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "기상송을 불러오지 못했습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
