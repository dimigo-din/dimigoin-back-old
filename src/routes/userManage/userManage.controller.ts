import { Body, Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CreatePasswordDto, CreateUserDto } from "./userManage.dto";
import { UserManageService } from "./userManage.service";

@ApiTags("User Manage")
@Controller("/manage/user")
export class UserManageController {
  constructor(private readonly userManageService: UserManageService) {}

  @ApiOperation({
    summary: "로그인 연결",
    description: "유저에 로그인 정보를 연결합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "로그인 연결 성공",
    type: Boolean,
  })
  @Post("/register/login/password")
  registerLoginPassword(@Body() data: CreatePasswordDto) {
    console.log(data);
    return this.userManageService.registerPasswordLogin(data);
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
  @Post("/register/user")
  registerUser(@Body() data: CreateUserDto) {
    console.log(data);
    return this.userManageService.registerUser(data);
  }
}