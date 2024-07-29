import { Body, Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DimigoLoginDto, PasswordLoginDto, TokensResponse } from "./auth.dto";
import { AuthService } from "./auth.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "핑" })
  @ApiResponse({ status: 200, description: "퐁" })
  @Get("/ping")
  ping() {
    return "pong";
  }

  @ApiOperation({
    summary: "패스워드 로그인",
    description: "분리된 패스워드 로그인 시스템입니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "로그인 성공",
    type: TokensResponse,
  })
  @Post("/login/password")
  passwordLogin(@Body() data: PasswordLoginDto) {
    return this.authService.passwordLogin(data);
  }

  @ApiOperation({
    summary: "앱 구글 로그인",
    description: "앱의 구글 로그인을 처리합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "로그인 성공",
    type: TokensResponse,
  })
  @Post("/login/dimigo")
  dimigoLogin(@Body() data: DimigoLoginDto) {
    return this.authService.dimigoLogin(data.token);
  }

  @ApiOperation({
    summary: "토큰 갱신",
    description: "Refresh Token을 사용하여 Access Token을 재발급합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "갱신 성공",
    type: TokensResponse,
  })
  @Post("/refresh")
  refresh(@Body() data) {
    return this.authService.refresh(data.token);
  }
}
