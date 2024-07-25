import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library";
import { Model, Types } from "mongoose";

import { Login, LoginDocument, User, UserDocument, UserStudent, UserStudentDocument } from "src/schemas";
import { type LoginType } from "src/common/types";

import { TokensResponse } from "./auth.dto";

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

	async test() {
		// const test = this.em.create(User, {
		// 	uuid: "itwillbeuuid",
		// 	name: "test",
		// });
		// await this.em.persistAndFlush(test);
	}

	async dimigoLogin(token) {
		const type: LoginType = "dimigo";

		try {
      const { tokens } = await this.googleOAuthClient.getToken(token);

			const ticket = await this.googleOAuthClient.verifyIdToken({
				idToken: tokens.id_token!,
			});
      const payload = ticket.getPayload();
	
			if (!payload) throw new Error("Cannot get payload from token.");
			const loginInfo = await this.loginModel.findOne({ type, value: payload.sub }).populate("User");
			if (!loginInfo) throw new Error("Cannot find login info.");
			const user = await this.userModel.findOne({ _id: loginInfo.user });
			if (!user) throw new Error("Cannot find user.");

			if(user.type === "student") {
				const student = await this.userStudentModel.findOne({ user: user._id });
				if (!student) throw new Error("Cannot find student.");
				
			} else if (user.type === "teacher") {
				// 선생님
			} else if (user.type === "admin") {
				// 관리자
			}else throw new Error();
			
      // return await this.userManageService.getUserByEmail();
    } catch (error) {
      throw new HttpException(
        "인증되지 않은 토큰입니다.\n" + error,
        HttpStatus.UNAUTHORIZED,
      );
    }
	}
}
