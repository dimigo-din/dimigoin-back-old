import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

// biome-ignore lint/style/useImportType: <explanation>
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

	@Get("/test")
	test() {
		this.authService.test();
		return "Test";
	}
}
