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

import { ApplyCancelDTO, LaundryApplyDTO, MachineListDTO } from "./laundry.dto";
import { LaundryService } from "./laundry.service";

@ApiTags("Laundry")
@Controller("/laundry")
export class LaundryController {
  constructor(private readonly laundryService: LaundryService) {}

  @ApiOperation({
    summary: "기기 목록",
    description: "세탁 기기목록과 현황을 불러옵니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "기기 리스트",
    type: [MachineListDTO],
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Get()
  list(@Request() req) {
    return this.laundryService.list(req.user);
  }

  @ApiOperation({
    summary: "세탁 신청",
    description: "세탁을 신청합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Post()
  apply(@Request() req, @Body() data: LaundryApplyDTO) {
    return this.laundryService.apply(req.user._id, data.target, data.time);
  }

  @ApiOperation({
    summary: "세탁 취소",
    description: "신청한 세탁을 취소합니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Delete()
  cancel(@Request() req, @Body() data: ApplyCancelDTO) {
    return this.laundryService.cancel(req.user._id, data.target);
  }
}
