import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
  ErrorHandler,
  FridayHomeError,
  LaundryError,
} from "../../common/errors";
import { User, UserDocument } from "../../schemas";
import {
  FridayHome,
  FridayHomeDocument,
} from "../../schemas/fridayHome.schema";

@Injectable()
export class FridayHomeService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(FridayHome.name)
    private readonly fridayHomeModel: Model<FridayHomeDocument>,
  ) {}

  // 난 왜 이친구가 제일로 싫지
  async list(userId) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new Error(FridayHomeError.UserNotFound);

      const applies = await this.fridayHomeModel.find({ user: user._id });
      if (!applies) return [];

      return applies.map((a) => a.toJSON());
    } catch (error) {
      console.log(error);
      ErrorHandler(FridayHomeError, error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        "금요귀가 신청 기록을 불러오는데 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async apply(userId, month, week, reason) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new Error(FridayHomeError.UserNotFound);

      const isApplied = await this.fridayHomeModel.findOne({
        user: user._id,
        month,
        week,
      });
      if (!!isApplied) throw new Error(FridayHomeError.AlreadyApplied);

      // TODO: month, week validating logic

      await new this.fridayHomeModel({
        user: user._id,
        month,
        week,
        reason,
      }).save();
    } catch (error) {
      console.log(error);
      ErrorHandler(FridayHomeError, error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        "금요귀가 신청에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancel(userId, target) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new Error(FridayHomeError.UserNotFound);

      const isApplied = await this.fridayHomeModel.findOne({
        _id: target,
        user: user._id,
      });
      if (!isApplied) throw new Error(FridayHomeError.NotApplied);

      isApplied.deleteOne();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(FridayHomeError, error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        "금요귀가 신청 취소에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
