import type { Model } from "mongoose";

import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import * as moment from "moment-timezone";
import * as youtubeSearch from "youtube-search";

import { ErrorHandler, MusicError, RateLimitError } from "../../common/errors";
import { RateLimitType } from "../../common/types";
import {
  MusicList,
  MusicListDocument,
  MusicVote,
  MusicVoteDocument,
  RateLimit,
  RateLimitDocument,
} from "../../schemas";

@Injectable()
export class MusicService {
  constructor(
    private configService: ConfigService,

    @InjectModel(MusicList.name)
    private musicListModel: Model<MusicListDocument>,
    @InjectModel(MusicVote.name)
    private musicVoteModel: Model<MusicVoteDocument>,
    @InjectModel(RateLimit.name)
    private rateLimitModel: Model<RateLimitDocument>,
  ) {}

  // Warning: 이건 주석 없으면 못읽는다 ㄹㅇ
  async list(user: string) {
    const week = moment().format("yyyyww");

    try {
      // 이번주에 신청된 전체 기상송 목록
      const musics = await this.musicListModel.find({
        week,
        selectedDate: null,
      });

      // 내 좋아요와 싫어요들
      const myVotes = await this.musicVoteModel.find({ week, user });

      // 기상송 별 좋아요 / 싫어요
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

      // 정리해서 보내주기 리턴 형식은 Music DTO에 SongList에 명시됨
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

          const doILike = !!myVotes.find(
            (v) => v.target.equals(m._id) && v.isUpVote,
          );
          const doIHate = !doILike;

          return {
            id: m.videoId,
            title: musicInfo.title,
            thumbnail: musicInfo.thumbnail_url,
            upVote,
            downVote,
            doILike,
            doIHate,
          };
        }),
      );
    } catch (error) {
      console.log(error);
      ErrorHandler(
        MusicError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "음악 검색에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async search(user: string, query: string) {
    const type: RateLimitType = "YoutubeSearch";

    try {
      const rateLimit = await this.rateLimitModel.findOne({ type, user });
      if (
        process.env.NODE_ENV !== "dev" &&
        !!rateLimit &&
        !moment().isAfter(moment.unix(rateLimit.time).add(15, "seconds"))
      )
        throw new Error(RateLimitError.RateLimitExceeded);

      const opts: youtubeSearch.YouTubeSearchOptions = {
        maxResults: 10,
        key: this.configService.get<string>("YOUTUBE_API_KEY"),
      };
      const { results } = await youtubeSearch(query, opts);

      await this.rateLimitModel.deleteMany({ type, user });
      await new this.rateLimitModel({
        type,
        user,
        time: moment().unix(),
      }).save();

      return results;
    } catch (error) {
      console.log(error);
      ErrorHandler(MusicError, error, HttpStatus.INTERNAL_SERVER_ERROR);
      ErrorHandler(
        RateLimitError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "음악 검색에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async applyMusic(user: string, videoId: string) {
    const day = moment().format("yyyyMMDD");
    const week = moment().format("yyyyww");

    try {
      const videoIdRegex = /^[a-zA-Z0-9]+$/;
      if (!videoIdRegex.test(videoId))
        throw new Error(MusicError.InvalidVideoId);

      const listCheck = await this.musicListModel.find({
        week,
        videoId,
      });
      if (listCheck.length > 0) throw new Error(MusicError.AlreadyApplied);

      await new this.musicListModel({
        day,
        week,
        videoId,
        user,
      }).save();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        MusicError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "기상송 등록에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async voteMusic(user: string, videoId: string, isUpVote: boolean) {
    const day = moment().format("yyyyMMDD");
    const week = moment().format("yyyyww");

    try {
      const isApplied = await this.musicListModel.findOne({ week, videoId });
      if (!isApplied) await this.applyMusic(user, videoId); // 이거 유지할지 고민중입니당.

      const music = (await this.musicListModel.findOne({ week, videoId }))!; // This cannot be null

      const userVote = await this.musicVoteModel.findOne({
        day,
        user,
        target: music._id,
      });
      if (userVote) userVote.deleteOne();
      if (userVote && userVote.isUpVote === isUpVote) return true;

      const userVotes = await this.musicVoteModel.find({ day, user });
      if (!!userVotes && userVotes.length > 3)
        throw new Error(MusicError.DailyVoteLimitExceeded);

      await new this.musicVoteModel({
        week,
        day,
        user,
        target: music._id,
        isUpVote,
      }).save();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        MusicError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "기상송 투표에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
