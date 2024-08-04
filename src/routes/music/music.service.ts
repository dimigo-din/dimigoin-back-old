import type { Model } from "mongoose";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import * as moment from "moment-timezone";
import * as youtubeSearch from "youtube-search";

import {
  AuthError,
  ErrorHandler,
  MusicError,
  RateLimitError,
} from "../../common/errors";
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
    const week = parseInt(moment().year() + "" + moment().week());

    try {
      const videoIdRegex = /[a-zA-Z0-9]*/;
      const videoIdCheck = videoIdRegex.exec(videoId);
      if (!videoIdCheck || videoIdCheck.length !== 1)
        throw new Error(MusicError.InvalidVideoId);

      const validatedVideoId = videoIdCheck[0];

      const listCheck = await this.musicListModel.find({
        week,
        videoId: validatedVideoId,
      });
      if (listCheck.length > 0) throw new Error(MusicError.AlreadyApplied);

      await new this.musicListModel({
        week,
        videoId: validatedVideoId,
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
}
