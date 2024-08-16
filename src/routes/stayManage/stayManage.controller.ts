import { Controller, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DIMIJwtAuthGuard } from "../../auth/guards/auth.guard";
import { DIMITeacherGuard } from "../../auth/guards/auth.guard.teacher";

import { StayManageService } from "./stayManage.service";

@ApiTags("Stay Manage")
@Controller("/manage/stay")
export class StayManageController {
  constructor(private readonly stayManageService: StayManageService) {}

  @ApiOperation({
    summary: "스케줄 목록",
    description: "세탁 스케줄 목록을 불러옵니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "스케줄 목록",
    // type: [MachineListDTO],
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post("/list/schedule")
  list() {
    return this.stayManageService.listSchedule();
  }
}
