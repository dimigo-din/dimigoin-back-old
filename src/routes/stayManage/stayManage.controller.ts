import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DIMIJwtAuthGuard } from "../../auth/guards/auth.guard";
import { DIMITeacherGuard } from "../../auth/guards/auth.guard.teacher";

import {
  OutGoingSelectDTO,
  SeatListDTO,
  StayScheduleDTO,
  StaySeatActiveDTO,
  StaySeatAddDTO,
  StaySeatDeleteDTO,
  StaySeatDTO,
  StayStatus,
  TeacherStayApplyDTO,
  TeacherStayCancelDTO,
} from "./stayManage.dto";
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
    summary: "잔류 좌석 현황",
    description: "잔류 좌석 목록을 불러옵니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "좌석 목록",
    type: [SeatListDTO],
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Get("/seat")
  staySeatList() {
    return this.stayManageService.list();
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
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Get()
  stayStatus() {
    return this.stayManageService.getStayStatus();
  }

  @ApiOperation({
    summary: "잔류 신청자 현황 다운로드",
    description:
      "잔류 신청자 목록을 저장합니다. 이쪽으로 리다이렉트 시켜버리면 다운로드됩니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "신청자 목록",
    type: [StayStatus],
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Get("/download")
  downloadStayStatus(@Res() res) {
    return this.stayManageService.downloadStayStatus(res);
  }

  @ApiOperation({
    summary: "잔류 신청",
    description: "잔류를 신청합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post()
  async apply(@Body() data: TeacherStayApplyDTO) {
    if (data.stayLocation === "studyroom")
      return this.stayManageService.applySeat(
        data.userId,
        data.stayLocationDetail,
      );
    else if (data.stayLocation === "class")
      return this.stayManageService.applyClass(data.userId);
    else if (data.stayLocation === "others")
      return this.stayManageService.applyOther(
        data.userId,
        data.stayLocationDetail,
      );
  }

  @ApiOperation({
    summary: "잔류 신청 취소",
    description: "잔류 신청을 취소합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Delete()
  cancel(@Body() data: TeacherStayCancelDTO) {
    return this.stayManageService.cancelStay(data.userId);
  }

  @ApiOperation({
    summary: "외출신청 허가",
    description: "잔류중 외출신청을 허가합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post("/outGoing/approve")
  approveGoingOut(@Body() data: OutGoingSelectDTO) {
    return this.stayManageService.approveGoingOut(data);
  }

  @ApiOperation({
    summary: "외출신청 반려",
    description: "잔류중 외출신청을 반려합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post("/outGoing/deny")
  denyGoingOut(@Body() data: OutGoingSelectDTO) {
    return this.stayManageService.denyGoingOut(data);
  }

  @ApiOperation({
    summary: "잔류좌석 프리셋 불러오기",
    description: "잔류좌석 프리셋을 불러옵니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "프리셋",
    type: [StaySeatDTO],
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Get("/preset")
  getPreset() {
    return this.stayManageService.getPreset();
  }

  @ApiOperation({
    summary: "잔류좌석 프리셋 등록",
    description: "잔류좌석 프리셋 등록합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post("/preset")
  addPreset(@Body() data: StaySeatAddDTO) {
    return this.stayManageService.addPreset(data);
  }

  @ApiOperation({
    summary: "잔류좌석 프리셋 삭제",
    description: "잔류좌석 프리셋 삭제합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Delete("/preset")
  deletePreset(@Body() data: StaySeatDeleteDTO) {
    return this.stayManageService.deletePreset(data.preset);
  }

  @ApiOperation({
    summary: "잔류좌석 프리셋 활성화",
    description: "잔류좌석 프리셋 활성화합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post("/preset/active")
  activePreset(@Body() data: StaySeatActiveDTO) {
    return this.stayManageService.activePreset(data.preset);
  }
}
