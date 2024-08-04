import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DIMIJwtAuthGuard } from "../../auth/auth.guard";

import { ApplyDTO, SearchDTO, YouTubeSearchResultsDTO } from "./music.dto";
import { MusicService } from "./music.service";

@ApiTags("Music")
@Controller("/music")
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @ApiOperation({
    summary: "음악 검색",
    description: "기상곡에 등록할 음악을 검색합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "음악 목록",
    type: [YouTubeSearchResultsDTO],
  })
  @UseGuards(DIMIJwtAuthGuard)
  @Post("/search")
  search(@Request() req, @Body() data: SearchDTO) {
    return this.musicService.search(req.user._id, data.query);
  }

  @ApiOperation({
    summary: "기상송 등록",
    description: "유튜브 비디오 아이디를 바탕으로 기상송을 등록합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "성공 여부",
    type: Boolean,
  })
  apply(@Request() req, @Body() data: ApplyDTO) {
    return this.musicService.applyMusic(req.user._id, data.videoId);
  }
}
