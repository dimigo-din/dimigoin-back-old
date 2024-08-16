import {
  Controller,
  Get,
  HttpStatus,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DIMIJwtAuthGuard } from "../../auth/guards/auth.guard";
import { DIMIStudentGuard } from "../../auth/guards/auth.guard.student";

import { MyLaundryDTO, MyStayDTO } from "./user.dto";
import { UserService } from "./user.service";

@ApiTags("User")
@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({
    summary: "내 세탁",
    description: "자신의 세탁 현황을 불러옵니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "세탁 정보. 없다면 null",
    type: MyLaundryDTO,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Get("/laundry")
  laundry(@Request() req) {
    return this.userService.getMyLaundry(req.user._id);
  }

  @ApiOperation({
    summary: "내 잔류",
    description: "자신의 잔류 현황을 불러옵니다.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "잔류 정보. 없다면 null",
    type: MyStayDTO,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
  @Get("/stay")
  stay(@Request() req) {
    return this.userService.getMyStay(req.user._id);
  }
}
