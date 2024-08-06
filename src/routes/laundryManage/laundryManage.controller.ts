import { Body, Controller, HttpStatus, Post, UseGuards } from "@nestjs/common";
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { DIMIJwtAuthGuard } from "../../auth/guards/auth.guard";
import { DIMITeacherGuard } from "../../auth/guards/auth.guard.teacher";

import { MachineApplyDTO, MachineDeleteDTO } from "./laundryManage.dto";
import { LaundryManageService } from "./laundryManage.service";

@ApiTags("Laundry Manage")
@Controller("/manage/laundry")
export class LaundryManageController {
  constructor(private readonly laundryManageService: LaundryManageService) {}

  @ApiOperation({
    summary: "기기 등록",
    description: "세탁 기기를 등록합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: "성공 여부",
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post("/apply")
  apply(@Body() data: MachineApplyDTO) {
    return this.laundryManageService.apply(
      data.gender,
      data.floor,
      data.pos,
      data.machineType,
    );
  }

  @ApiOperation({
    summary: "기기 삭제",
    description: "등록된 세탁 기기를 삭제합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: "성공 여부",
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post("/delete")
  delete(@Body() data: MachineDeleteDTO) {
    return this.laundryManageService.delete(data.id);
  }
}
