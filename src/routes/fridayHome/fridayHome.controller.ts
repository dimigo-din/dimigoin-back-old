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

import {
  FridayHomeApplyDTO,
  FridayHomeCancelDTO,
  FridayHomeListDTO,
} from "./fridayHome.dto";
import { FridayHomeService } from "./fridayHome.service";

@ApiTags("Friday Home")
@Controller("/fridayHome")
export class FridayHomeController {
  constructor(private readonly fridayHomeService: FridayHomeService) {}

  @ApiOperation({
    summary: "금요귀가 신청 목록",
    description: "본인의 금요귀가 신청 목록을 불러옵니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "금요귀가 신청 목록",
    type: [FridayHomeListDTO],
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Post("/list")
  list(@Request() req) {
    return this.fridayHomeService.list(req.user._id);
  }

  @ApiOperation({
    summary: "금요귀가 신청",
    description: "금요귀가를 신청합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Post("/apply")
  apply(@Request() req, @Body() data: FridayHomeApplyDTO) {
    return this.fridayHomeService.apply(
      req.user._id,
      data.month,
      data.week,
      data.reason,
    );
  }

  @ApiOperation({
    summary: "금요귀가 신청 취소",
    description: "본인의 금요귀가 신청을 취소합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Post("/cancel")
  cancel(@Request() req, @Body() data: FridayHomeCancelDTO) {
    return this.fridayHomeService.cancel(req.user._id, data.target);
  }
}
