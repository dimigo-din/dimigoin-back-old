import type { Model } from "mongoose";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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

  // TODO: Make list function that returns musicList without selected is true

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
      ErrorHandler(RateLimitError, error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        "음악 검색에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async applyMusic(user, videoId) {
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
        week,
        videoId,
        user,
      }).save();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(MusicError, error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        "기상송 등록에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async voteMusic(user: string, videoId: string, isUpVote: boolean) {
    const day = moment().format("yyyyMMDD");
    const week = moment().format("yyyyww");

    try {
      const userVotes = await this.musicVoteModel.find({ day, user });
      if (!!userVotes && userVotes.length > 3)
        throw new Error(MusicError.DailyVoteLimitExceeded);

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
      ErrorHandler(MusicError, error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        "기상송 투표에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
