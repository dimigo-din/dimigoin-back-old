import type { Model } from "mongoose";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import * as moment from "moment-timezone";
import * as youtubeSearch from "youtube-search";

import { MusicError, RateLimitError } from "../../common/errors";
import { RateLimitType } from "../../common/types";
import { RateLimit } from "../../schemas/ratelimit.schema";

@Injectable()
export class MusicService {
  constructor(
    private configService: ConfigService,

    @InjectModel(RateLimit.name)
    private rateLimitModel: Model<RateLimit>,
  ) {}

  async search(user: string, query: string) {
    const type: RateLimitType = "YoutubeSearch";

    try {
      // const rateLimit = await this.rateLimitModel.findOne({ type, user });
      // if (
      //   !!rateLimit &&
      //   !moment().isAfter(moment.unix(rateLimit.time).add(15, "seconds"))
      // )
      //   throw new Error(RateLimitError.RateLimitExceeded);

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
      if (
        Object.values(RateLimitError).includes(error.message) ||
        Object.values(MusicError).includes(error.message)
      ) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          "음악 검색에 실패하였습니다.",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async applyMusic(user, videoId) {
    try {
    } catch (error) {
      console.log(error);
      if (Object.values(MusicError).includes(error.message)) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          "음악 등록에 실패하였습니다.",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
