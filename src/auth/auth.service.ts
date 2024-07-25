import type { Model } from "mongoose";
import type { LoginType } from "src/common/types";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { OAuth2Client } from "google-auth-library";

import {
  Login,
  type LoginDocument,
  User,
  type UserDocument,
  UserStudent,
  type UserStudentDocument,
} from "src/schemas";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,

    @InjectModel(Login.name)
    private loginModel: Model<LoginDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(UserStudent.name)
    private userStudentModel: Model<UserStudentDocument>,
  ) {}

  googleOAuthClient = new OAuth2Client(
    this.configService.get<string>("GOOGLE_CLIENT_ID"),
    this.configService.get<string>("GOOGLE_CLIENT_SECRET"),
  );

  async dimigoLogin(token: string) {
    const type: LoginType = "dimigo";

    try {
      const { tokens } = await this.googleOAuthClient.getToken(token);
      if (!tokens.id_token)
        throw new Error("구글 토큰에서 id_token을 가져올 수 없습니다.");

      const ticket = await this.googleOAuthClient.verifyIdToken({
        idToken: tokens.id_token,
      });
      const payload = ticket.getPayload();

      if (!payload)
        throw new Error("구글 토큰에서 payload를 가져올 수 없습니다.");
      const loginInfo = await this.loginModel
        .findOne({ type, value: payload.sub })
        .populate("User");
      if (!loginInfo) throw new Error("로그인 정보를 찾을 수 없습니다.");
      const user = await this.userModel.findOne({ _id: loginInfo.user });
      if (!user) throw new Error("사용자 정보를 찾을 수 없습니다.");

      if (user.type === "student") {
        const student = await this.userStudentModel.findOne({ user: user._id });
        if (!student) throw new Error("학생 정보를 찾을 수 없습니다.");
      } else if (user.type === "teacher") {
        // 선생님
      } else if (user.type === "admin") {
        // 관리자
      } else throw new Error();

      // return await this.userManageService.getUserByEmail();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        "인증되지 않은 토큰입니다.",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
