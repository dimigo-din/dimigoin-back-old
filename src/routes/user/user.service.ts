import type { Model } from "mongoose";

import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { ErrorHandler, UserError } from "../../common/errors";
import {
  LaundryApply,
  LaundryApplyDocument,
  LaundryMachinePopulator,
  LaundryTimetablePopulator,
  Login,
  LoginDocument,
  MusicVote,
  MusicVoteDocument,
  StayApply,
  StayApplyDocument,
  StayGoingOut,
  StayGoingOutDocument,
  StaySeatPopulator,
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
    @InjectModel(StayApply.name)
    private stayApplyModel: Model<StayApplyDocument>,
    @InjectModel(StayGoingOut.name)
    private stayGoingOutModel: Model<StayGoingOutDocument>,
  ) {}

  async getLoginMethods(userId) {
    try {
      const logins = await this.loginModel.find({ user: userId });

      return logins.map((l) => {
        return l.type;
      });
    } catch (error) {
      console.log(error);
      ErrorHandler(
        UserError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "로그인 방식 목록을 불러오는데 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMyLaundry(userId: string) {
    try {
      const apply = await this.laundryApplyModel
        .findOne({ user: userId })
        .populate(LaundryMachinePopulator)
        .populate(LaundryTimetablePopulator);
      if (!apply) return null;

      return {
        _id: apply._id,
        machineId: apply[LaundryMachinePopulator]._id,
        timeId: apply[LaundryTimetablePopulator]._id,
        machine: apply[LaundryMachinePopulator].name,
        time: apply[LaundryTimetablePopulator].time,
        type: apply[LaundryMachinePopulator].type,
      };
    } catch (error) {
      console.log(error);
      ErrorHandler(
        UserError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "세탁 현황을 불러오는데 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMyStay(userId: string) {
    try {
      const apply = await this.stayApplyModel
        .findOne({ user: userId })
        .populate(StaySeatPopulator);
      if (!apply) return null;

      const goingOut = await this.stayGoingOutModel.findOne({
        stay: apply._id,
      });

      return {
        _id: apply._id,
        seat: apply[StaySeatPopulator].seat,
        isGoingOut: !!goingOut,
        ...(!!goingOut
          ? { from: goingOut.from, to: goingOut.to, reason: goingOut.reason }
          : {}),
      };
    } catch (error) {
      console.log(error);
      ErrorHandler(
        UserError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "잔류 현황을 불러오는데 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
