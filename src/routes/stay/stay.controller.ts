import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DIMIJwtAuthGuard } from "../../auth/guards/auth.guard";
import { DIMIStudentGuard } from "../../auth/guards/auth.guard.student";

import { SeatListDTO, StayApplyDTO } from "./stay.dto";
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
  @Post("/list")
  list(@Request() req) {
    return this.stayService.list(req.user);
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
  @Post("/apply")
  apply(@Request() req, @Body() data: StayApplyDTO) {
    if (data.stayLocation === "studyroom")
      return this.stayService.applySeat(req.user._id, data.stayLocationDetail);
    else if (data.stayLocation === "class")
      return this.stayService.applyClass(req.user._id);
    else if (data.stayLocation === "others")
      return this.stayService.applyOther(req.user._id, data.stayLocationDetail);
  }
}
