import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";

import { AuthError } from "../common/errors";

import { DIMIJwtPayload } from "./auth.interface";
import { AuthService } from "./auth.service";

@Injectable()
export class DIMIJwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_PRIVATE"),
    });
  }

  async validate(
    payload: DIMIJwtPayload,
    done: VerifiedCallback,
  ): Promise<any> {
    if (!payload.refresh) {
      const user = await this.authService.getUserByObjectId(
        payload._id.toString(),
      );
      if (!user) throw new Error(AuthError.UserNotFound);
      return done(null, user);
    } else {
      throw new HttpException(
        "잘못된 토큰 형식입니다. Access Token을 전달해주세요.",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
