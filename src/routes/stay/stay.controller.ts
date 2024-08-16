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
import { DIMIStudentGuard } from "../../auth/guards/auth.guard.student";

import {
  GoingOutCancelDTO,
  SeatListDTO,
  StayApplyDTO,
  StayGoingOutApplyDTO,
} from "./stay.dto";
import { StayService } from "./stay.service";

@ApiTags("Stay")
@Controller("/stay")
export class StayController {
  constructor(private readonly stayService: StayService) {}

  @ApiOperation({
    summary: "좌석 목록",
    description: "잔류 열람실 좌석 목록을 불러옵니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "좌석 리스트",
    type: [SeatListDTO],
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Get()
  list(@Request() req) {
    return this.stayService.list(req.user._id);
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
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Post()
  async apply(@Request() req, @Body() data: StayApplyDTO) {
    await this.stayService.checkSchedule(req.user._id, data.stayLocation);
    if (data.stayLocation === "studyroom")
      return this.stayService.applySeat(req.user._id, data.stayLocationDetail);
    else if (data.stayLocation === "class")
      return this.stayService.applyClass(req.user._id);
    else if (data.stayLocation === "others")
      return this.stayService.applyOther(req.user._id, data.stayLocationDetail);
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
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Delete()
  cancel(@Request() req) {
    return this.stayService.cancelStay(req.user._id);
  }

  @ApiOperation({
    summary: "외출신청 목록",
    description: "외출신청 목록을 확인합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "외출신청 목록",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Post("/goingOut")
  goingOutList(@Request() req) {
    return this.stayService.goingOutList(req.user._id);
  }

  @ApiOperation({
    summary: "잔류중 외출 신청",
    description: "잔류중 외출을 신청합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Post("/goingOut")
  applyGoingOut(@Request() req, @Body() data: StayGoingOutApplyDTO) {
    console.log(data);
    return this.stayService.goingOutApply(
      req.user._id,
      data.mealCancel,
      data.day,
      data.from,
      data.to,
      data.reason,
    );
  }

  @ApiOperation({
    summary: "잔류중 외출 신청 취소",
    description: "잔류중 외출 신청을 취소합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Delete("/goingOut")
  cancelGoingOut(@Request() req, @Body() data: GoingOutCancelDTO) {
    return this.stayService.goingOutDelete(req.user._id, data.goingOutId);
  }
}
