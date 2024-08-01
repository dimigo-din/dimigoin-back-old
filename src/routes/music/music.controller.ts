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

import { SearchDTO, YouTubeSearchResultsDTO } from "./music.dto";
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
}
