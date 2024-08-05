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
import { DIMITeacherGuard } from "../../auth/auth.guard.teacher";

import { DeleteDTO, SelectDTO } from "./musicManage.dto";
import { MusicManageService } from "./musicManage.service";

@ApiTags("MusicManage")
@Controller("/manage/music")
export class MusicManageController {
  constructor(private readonly musicManageService: MusicManageService) {}

  @ApiOperation({
    summary: "기상곡 확정",
    description: "당일 나올 기상송을 확정짓습니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post("/select")
  select(@Request() req, @Body() data: SelectDTO) {
    return this.musicManageService.select(req.user._id, data.videoId);
  }

  @ApiOperation({
    summary: "기상곡 삭제",
    description: "신청된 기상송을 삭제합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post("/delete")
  delete(@Body() data: DeleteDTO) {
    return this.musicManageService.delete(data.videoId);
  }
}
