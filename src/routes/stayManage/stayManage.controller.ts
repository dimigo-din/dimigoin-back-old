import { Controller, Get, HttpStatus, Res, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DIMIJwtAuthGuard } from "../../auth/guards/auth.guard";
import { DIMITeacherGuard } from "../../auth/guards/auth.guard.teacher";

import { StayScheduleDTO, StayStatus } from "./stayManage.dto";
import { StayManageService } from "./stayManage.service";

@ApiTags("Stay Manage")
@Controller("/manage/stay")
export class StayManageController {
  constructor(private readonly stayManageService: StayManageService) {}

  @ApiOperation({
    summary: "스케줄 목록",
    description: "잔류 스케줄 목록을 불러옵니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "스케줄 목록",
    type: [StayScheduleDTO],
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Get("/schedule")
  list() {
    return this.stayManageService.listSchedule();
  }

  @ApiOperation({
    summary: "잔류 신청자 현황 다운로드",
    description: "잔류 신청자 목록을 저장합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "신청자 목록",
    type: [StayStatus],
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Get()
  stayStatus() {
    return this.stayManageService.getStayStatus();
  }

  @ApiOperation({
    summary: "잔류 신청자 현황",
    description: "잔류 신청자 목록을 불러옵니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "신청자 목록",
    type: [StayStatus],
  })
  // @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Get("/download")
  downloadStayStatus(@Res() res) {
    return this.stayManageService.downloadStayStatus(res);
  }
}
