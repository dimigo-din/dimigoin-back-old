import { Body, Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { LoginDto, TokensResponse } from "./auth.dto";
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
    summary: "앱 구글 로그인",
    description: "앱의 구글 로그인을 처리합니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "로그인 성공",
    type: TokensResponse,
  })
  @Post("/login/dimigo")
  dimigoLogin(@Body() data: LoginDto) {
    console.log(data);
    return this.authService.dimigoLogin(data.token);
  }
}
