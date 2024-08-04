import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DIMIJwtAuthGuard } from "../../auth/auth.guard";
import { DIMIAdminGuard } from "../../auth/auth.guard.admin";
import { DIMITeacherGuard } from "../../auth/auth.guard.teacher";

import {
  CreateDimigoLoginDTO,
  CreatePasswordLoginDTO,
  CreateUserDTO,
  CreateUserStudentDTO,
} from "./userManage.dto";
import { UserManageService } from "./userManage.service";

@ApiTags("User Manage")
@Controller("/manage/user")
export class UserManageController {
  constructor(private readonly userManageService: UserManageService) {}

  @ApiOperation({
    summary: "연결된 로그인 목록",
    description: "계정에 연결된 로그인 목록을 불러옵니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(DIMIJwtAuthGuard)
  @Post("/login")
  getLogin(@Request() req) {
    return this.userManageService.getLogin(req.user._id);
  }

  @ApiOperation({
    summary: "로그인 연결 - 비밀번호",
    description: "유저에 비밀번호를 이용한 로그인 정보를 연결합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "로그인 연결 성공",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMIAdminGuard)
  @Post("/login/password")
  registerPasswordLogin(@Request() req, @Body() data: CreatePasswordLoginDTO) {
    console.log(data);
    return this.userManageService.registerPasswordLogin(req.user._id, data);
  }

  @ApiOperation({
    summary: "로그인 연결 - 디미고",
    description: "유저에 디미고 구글 계정을 이용한 로그인 정보를 연결합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "로그인 연결 성공",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post("/login/dimigo")
  registerDimigoLogin(@Body() data: CreateDimigoLoginDTO) {
    console.log(data);
    return this.userManageService.registerDimigoLogin(data);
  }

  @ApiOperation({
    summary: "유저 생성",
    description: "DB에 유저를 생성합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "유저 생성 성공",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post("/register")
  registerUser(@Body() data: CreateUserDTO) {
    console.log(data);
    return this.userManageService.registerUser(data);
  }

  @ApiOperation({
    summary: "유저 생성",
    description: "DB에 유저를 생성합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "유저 생성 성공",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, DIMITeacherGuard)
  @Post("/register/student")
  registerUserStudent(@Body() data: CreateUserStudentDTO) {
    console.log(data);
    return this.userManageService.registerUserStudent(data);
  }
}
