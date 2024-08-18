import type { Model } from "mongoose";
import type { LoginType } from "src/common/types";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import * as moment from "moment-timezone";

import {
  Login,
  type LoginDocument,
  Password,
  type PasswordDocument,
  User,
  type UserDocument,
  UserStudent,
  type UserStudentDocument,
  Token,
  type TokenDocument,
} from "src/schemas";

import { AuthError, ErrorHandler, UserManageError } from "../common/errors";

import { PasswordLoginDTO, TokensResponse } from "./auth.dto";
import { DIMIRefreshPayload } from "./auth.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectModel(Login.name)
    private loginModel: Model<LoginDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(UserStudent.name)
    private userStudentModel: Model<UserStudentDocument>,
    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,
    @InjectModel(Password.name)
    private passwordModel: Model<PasswordDocument>,
  ) {}

  googleOAuthClient = new OAuth2Client(
    this.configService.get<string>("GOOGLE_CLIENT_ID"),
    this.configService.get<string>("GOOGLE_CLIENT_SECRET"),
  );

  googleWebOAuthClient = new OAuth2Client(
    this.configService.get<string>("GOOGLE_CLIENT_ID"),
    this.configService.get<string>("GOOGLE_CLIENT_SECRET"),
    "postmessage",
  );

  async getUserByObjectId(id: string) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new Error(UserManageError.UserNotFound);

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async passwordLogin(data: PasswordLoginDTO) {
    try {
      const password = await this.passwordModel.findOne({ id: data.id });
      if (!password) throw new Error(AuthError.LoginInfoUnavailable);
      if (!bcrypt.compareSync(data.password, password.password))
        throw new Error(AuthError.PasswordMismatch);

      const user = await this.userModel.findById(password.user);
      if (!user) throw new Error(AuthError.UserNotFound);

      if (user.type === "student") {
        const student = await this.userStudentModel.findOne({ user: user._id });
        if (!student) throw new Error(AuthError.StudentNotFound);

        return this.createToken({ ...student.toJSON(), ...user.toJSON() });
      } else if (user.type === "teacher") {
        return this.createToken(user.toJSON());
      } else if (user.type === "admin") {
        return this.createToken(user.toJSON());
      } else throw new Error(AuthError.ForbiddenUserType);
    } catch (error) {
      console.log(error);
      ErrorHandler(
        AuthError,
        error,
        HttpStatus.UNAUTHORIZED,
        "비밀번호 인증에 실패하였습니다.",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async dimigoLogin(token: string, isWeb: boolean) {
    const type: LoginType = "dimigo";

    const currentOAuthClient = isWeb
      ? this.googleWebOAuthClient
      : this.googleOAuthClient;
    try {
      const { tokens } = await currentOAuthClient.getToken(token);
      if (!tokens.id_token) throw new Error(AuthError.CannotGetGoogleIdToken);

      const ticket = await currentOAuthClient.verifyIdToken({
        idToken: tokens.id_token,
      });
      const payload = ticket.getPayload();
      if (!payload) throw new Error(AuthError.CannotGetGooglePayload);

      const loginInfo = await this.loginModel.findOne({
        type,
        value: payload.email,
      });
      if (!loginInfo) throw new Error(AuthError.LoginInfoUnavailable);

      const user = await this.userModel.findOne({ _id: loginInfo.user });
      if (!user) throw new Error(AuthError.UserNotFound);

      if (user.type === "student") {
        const student = await this.userStudentModel.findOne({
          user: user._id,
          year: moment().year(),
        });
        if (!student) throw new Error(AuthError.StudentNotFound);

        return this.createToken({ ...student.toJSON(), ...user.toJSON() });
      } else if (user.type === "teacher") {
        return this.createToken(user.toJSON());
      } else if (user.type === "admin") {
        return this.createToken(user.toJSON());
      } else throw new Error(AuthError.ForbiddenUserType);
    } catch (error) {
      console.log(error);
      ErrorHandler(
        AuthError,
        error,
        HttpStatus.UNAUTHORIZED,
        "인증되지 않은 토큰입니다.",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async refresh(token: string) {
    try {
      const payload: DIMIRefreshPayload =
        await this.jwtService.verifyAsync(token);
      if (!payload.refresh) throw new Error(AuthError.NoRefreshToken);

      console.log(payload);
      const user = await this.userModel.findById(payload._id);
      if (!user) throw new Error(AuthError.UserNotFound);

      if (user.type === "student") {
        const student = await this.userStudentModel.findOne({ user: user._id });
        if (!student) throw new Error(AuthError.StudentNotFound);

        await this.tokenModel.deleteOne({ refreshToken: token });

        return this.createToken({ ...student.toJSON(), ...user.toJSON() });
      } else if (user.type === "teacher") {
        return this.createToken(user.toJSON());
      } else if (user.type === "admin") {
        return this.createToken(user.toJSON());
      } else throw new Error(AuthError.ForbiddenUserType);
    } catch (error) {
      console.log(error);
      if (error.name == "TokenExpiredError") {
        throw new HttpException(
          "토큰이 만료되었습니다.",
          HttpStatus.UNAUTHORIZED,
        );
      }
      ErrorHandler(
        AuthError,
        error,
        HttpStatus.UNAUTHORIZED,
        "인증되지 않은 토큰입니다.",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async createToken(user): Promise<TokensResponse | null> {
    const accessToken = await this.jwtService.signAsync(
      {
        ...user,
        refresh: false,
      },
      {
        expiresIn: "30m",
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        _id: user._id,
        refresh: true,
      },
      {
        expiresIn: "1y",
      },
    );

    await new this.tokenModel({ refreshToken, user: user._id }).save();

    return {
      accessToken,
      refreshToken,
    };
  }
}
