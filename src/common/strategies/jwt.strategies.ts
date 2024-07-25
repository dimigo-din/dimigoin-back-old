// import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
// import type { ConfigService } from "@nestjs/config";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy, type VerifiedCallback } from "passport-jwt";

// import type { UserManageService } from "src/routes/user/providers";

// import { globalOpcode } from "src/common/opcode";
// import type { DIMIJwtPayload } from "../interface";

// @Injectable()
// export class DIMIJwtStrategy extends PassportStrategy(Strategy, "jwt") {
// 	constructor(configService: ConfigService) {
// 		super({
// 			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// 			ignoreExpiration: false,
// 			secretOrKey: configService.get<string>("JWT_SECRET_KEY"),
// 		});
// 	}

// 	async validate(
// 		payload: DIMIJwtPayload,
// 		done: VerifiedCallback,
// 	): Promise<any> {
// 		if (!payload.refresh) {
// 			const user = await this.userManageService.getUserByObjectId(payload._id);
// 			if (user) {
// 				return done(null, user);
// 			}
// 		} else {
// 			throw globalOpcode.NoPermission();
// 		}
// 	}
// }
