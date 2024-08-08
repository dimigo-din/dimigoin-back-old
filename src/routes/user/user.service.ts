import type { Model } from "mongoose";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { ErrorHandler, UserError } from "../../common/errors";
import {
  LaundryApply,
  LaundryApplyDocument,
  Login,
  LoginDocument,
  MusicVote,
  MusicVoteDocument,
  Token,
  TokenDocument,
  User,
  UserDocument,
  UserStudent,
  UserStudentDocument,
} from "../../schemas";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Login.name)
    private loginModel: Model<LoginDocument>,
    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(UserStudent.name)
    private useStudentModel: Model<UserStudentDocument>,
    @InjectModel(MusicVote.name)
    private musicVoteModel: Model<MusicVoteDocument>,
    @InjectModel(LaundryApply.name)
    private laundryApplyModel: Model<LaundryApplyDocument>,
  ) {}

  async getLoginMethods(userId) {
    try {
      const logins = await this.loginModel.find({ user: userId });

      return logins.map((l) => {
        return l.type;
      });
    } catch (error) {
      console.log(error);
      ErrorHandler(UserError, error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        "기상송 등록에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAliveSessions(userId) {
    try {
      const logins = await this.loginModel.find({ user: userId });

      return logins.map((l) => {
        return l.type;
      });
    } catch (error) {
      console.log(error);
      ErrorHandler(UserError, error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        "기상송 등록에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
