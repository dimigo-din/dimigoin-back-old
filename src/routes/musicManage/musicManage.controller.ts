import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DIMIJwtAuthGuard } from "../../auth/guards/auth.guard";
import { DIMITeacherGuard } from "../../auth/guards/auth.guard.teacher";

import { DeleteDTO, SelectDTO } from "./musicManage.dto";
import { MusicManageService } from "./musicManage.service";

@ApiTags("Music Manage")
@Controller("/manage/music")
export class MusicManageController {
  constructor(private readonly musicManageService: MusicManageService) {}

  @ApiOperation({
    summary: "기상곡 목록",
    description: "기상곡 목록을 불러옵니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "기상곡 목록",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Get()
  list() {
    return this.musicManageService.musicList();
  }

  @ApiOperation({
    summary: "기상곡 확정",
    description: "당일 나올 기상송을 확정짓습니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post()
  select(@Request() req, @Body() data: SelectDTO) {
    return this.musicManageService.select(req.user._id, data.videoId);
  }

  @ApiOperation({
    summary: "기상곡 삭제",
    description: "신청된 기상송을 삭제합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Delete()
  delete(@Body() data: DeleteDTO) {
    return this.musicManageService.delete(data.videoId);
  }
}
