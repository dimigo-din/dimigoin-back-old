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

import { ApplyCancelDTO, ApplyDTO, MachineListDTO } from "./laundry.dto";
import { LaundryService } from "./laundry.service";

@ApiTags("Laundry")
@Controller("/laundry")
export class LaundryController {
  constructor(private readonly laundryService: LaundryService) {}

  @ApiOperation({
    summary: "기기 목록",
    description: "세탁 기기목록을 불러옵니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "기기 리스트",
    type: [MachineListDTO],
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Post("/list")
  list(@Request() req) {
    return this.laundryService.list(req.user);
  }

  @ApiOperation({
    summary: "세탁 신청",
    description: "세탁을 신청합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Post("/apply")
  apply(@Request() req, @Body() data: ApplyDTO) {
    return this.laundryService.apply(req.user._id, data.target, data.time);
  }

  @ApiOperation({
    summary: "세탁 취소",
    description: "신청한 세탁을 취소합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Post("/delete")
  cancel(@Request() req, @Body() data: ApplyCancelDTO) {
    return this.laundryService.cancel(req.user._id, data.target);
  }
}
