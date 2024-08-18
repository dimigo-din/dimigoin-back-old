import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DIMIJwtAuthGuard } from "../../auth/guards/auth.guard";
import { DIMIStudentGuard } from "../../auth/guards/auth.guard.student";

import {
  MusicApplyDTO,
  MusicListDTO,
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
    summary: "기상송 목록",
    description: "등록된 기상송을 확인합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "기상송 목록",
    type: [YouTubeSearchResultsDTO],
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Get()
  list(@Request() req) {
    return this.musicService.list(req.user._id);
  }

  @ApiOperation({
    summary: "음악 검색",
    description: "기상곡에 등록할 음악을 검색합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "음악 목록",
    type: [MusicListDTO],
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
    status: HttpStatus.CREATED,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Post("/apply")
  apply(@Request() req, @Body() data: MusicApplyDTO) {
    return this.musicService.applyMusic(req.user._id, data.videoId);
  }

  @ApiOperation({
    summary: "기상송 투표",
    description:
      "등록되어있는 기상송을 투표합니다. 만약 등록이 안되어있다면, 등록도 같이 진행합니다. 만약 이미 같은 투표를 진행했다면 해당 투표를 취소합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
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
