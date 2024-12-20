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

import {
  MachineDeleteDTO,
  LaundryTimeDTO,
  LaundryTimeDeleteDTO,
  MachineListManageDTO,
  LaundryApplyStatus,
} from "./laundryManage.dto";
import { LaundryManageService } from "./laundryManage.service";

@ApiTags("Laundry Manage")
@Controller("/manage/laundry")
export class LaundryManageController {
  constructor(private readonly laundryManageService: LaundryManageService) {}

  @ApiOperation({
    summary: "세탁신청 목록",
    description: "세탁신청 목록을 반환합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "세탁신청 목록",
    type: [LaundryApplyStatus],
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Get("/apply")
  applyList(@Request() req) {
    return this.laundryManageService.applyStatus(req.user._id);
  }

  @ApiOperation({
    summary: "기기 목록",
    description: "등록된 기기의 목록을 반환합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "기기 목록",
    type: [MachineListManageDTO],
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Get("/machine")
  machineList() {
    return this.laundryManageService.machineList();
  }

  @ApiOperation({
    summary: "기기 등록",
    description: "세탁 기기를 등록합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Boolean,
    description: "성공 여부",
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post("/machine")
  machineApply(@Body() data: MachineListManageDTO) {
    return this.laundryManageService.machineApply(
      data.gender,
      data.floor,
      data.pos,
      data.machineType,
      data.allow,
    );
  }

  @ApiOperation({
    summary: "기기 삭제",
    description: "등록된 세탁 기기를 삭제합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Boolean,
    description: "성공 여부",
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Delete("/machine")
  machineDelete(@Body() data: MachineDeleteDTO) {
    return this.laundryManageService.machineDelete(data.id);
  }

  @ApiOperation({
    summary: "세탁 시간 목록",
    description: "등록된 세탁 시간 목록을 불러옵니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: [LaundryTimeDTO],
    description: "시간표 목록",
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Get("/time")
  timeList() {
    return this.laundryManageService.timeList();
  }

  @ApiOperation({
    summary: "세탁 시간 등록",
    description: "세탁 시간표를 등록합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Boolean,
    description: "성공 여부",
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post("/time")
  timeApply(@Body() data: LaundryTimeDTO) {
    return this.laundryManageService.timeApply(data);
  }

  @ApiOperation({
    summary: "세탁 시간 삭제",
    description: "등록된 세탁 시간를 삭제합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Boolean,
    description: "성공 여부",
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Delete("/time")
  timeDelete(@Body() data: LaundryTimeDeleteDTO) {
    return this.laundryManageService.timeDelete(data.id);
  }
}
