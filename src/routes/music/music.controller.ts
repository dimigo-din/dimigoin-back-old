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
import { DIMIStudentGuard } from "../../auth/auth.guard.student";

import {
  ApplyDTO,
  SearchDTO,
  VoteDTO,
  YouTubeSearchResultsDTO,
} from "./music.dto";
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
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
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
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Post("/apply")
  apply(@Request() req, @Body() data: ApplyDTO) {
    return this.musicService.applyMusic(req.user._id, data.videoId);
  }

  @ApiOperation({
    summary: "기상송 투표",
    description:
      "등록되어있는 기상송을 투표합니다. 만약 등록이 안되어있다면, 등록도 같이 진행합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Post("/vote")
  vote(@Request() req, @Body() data: VoteDTO) {
    return this.musicService.voteMusic(
      req.user._id,
      data.videoId,
      data.isUpVote,
    );
  }
}
