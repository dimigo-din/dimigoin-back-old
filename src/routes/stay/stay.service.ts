import type { Model } from "mongoose";

import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { ErrorHandler, StayError } from "../../common/errors";
import { MealSchedule } from "../../common/types";
import {
  StayApply,
  StayApplyDocument,
  StayGoingOut,
  StayGoingOutDocument,
  StaySchedule,
  StayScheduleDocument,
  StaySeat,
  StaySeatDocument,
  User,
  UserDocument,
  UserPopulator,
  UserStudentPopulator,
} from "../../schemas";

@Injectable()
export class StayService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(StayApply.name)
    private readonly stayApplyModel: Model<StayApplyDocument>,
    @InjectModel(StaySchedule.name)
    private readonly stayScheduleModel: Model<StayScheduleDocument>,
    @InjectModel(StaySeat.name)
    private readonly staySeatModel: Model<StaySeatDocument>,
    @InjectModel(StayGoingOut.name)
    private readonly stayGoingOutModel: Model<StayGoingOutDocument>,
  ) {}

  // TODO: Schedule check

  async list(userId: string) {
    try {
      const seats = await this.staySeatModel.find({});
      const applies = await this.stayApplyModel
        .find({})
        .populate(UserPopulator);

      return seats.map((s) => {
        const thisApply = applies.find((a) => a._id.equals(s._id));

        return {
          _id: s._id,
          seat: s.seat,
          grade: s.grade,
          isApplied: !!thisApply,
          ...(!!thisApply
            ? {
                applierId: thisApply[UserPopulator]._id,
                applierName: thisApply[UserPopulator].name,
              }
            : {}),
          ...(!!thisApply && thisApply[UserPopulator]._id.equals(userId)
            ? { isMine: true }
            : {}),
        };
      });
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "열람실 좌석 목록을 가져오는데 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async applySeat(userId: string, seatId: string) {
    try {
      const user = await this.userModel
        .findById(userId)
        .populate(UserStudentPopulator);
      if (!user) throw new Error(StayError.UserNotFound);

      const myApply = await this.stayApplyModel.findOne({ user: user._id });
      if (!!myApply) throw new Error(StayError.YouAlreadyApplied);

      const apply = await this.stayApplyModel.findOne({ seat: seatId });
      if (!!apply) throw new Error(StayError.SeatAlreadyApplied);

      const seat = await this.staySeatModel.findById(seatId);
      if (!seat) throw new Error(StayError.SeatNotFound);

      if (
        seat.toJSON().grade.find((g) => g === user[UserStudentPopulator].grade)
      )
        throw new Error(StayError.DisAllowedGrade);

      await new this.stayApplyModel({
        user: user._id,
        seat: seat._id,
      }).save();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "잔류신청에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async applyClass(userId: string) {
    try {
      const user = await this.userModel
        .findById(userId)
        .populate(UserStudentPopulator);
      if (!user) throw new Error(StayError.UserNotFound);

      const myApply = await this.stayApplyModel.findOne({ user: user._id });
      if (!!myApply) throw new Error(StayError.YouAlreadyApplied);

      await new this.stayApplyModel({
        user: user._id,
        other: "class",
      }).save();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "잔류신청에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async applyOther(userId: string, location: string) {
    try {
      const user = await this.userModel
        .findById(userId)
        .populate(UserStudentPopulator);
      if (!user) throw new Error(StayError.UserNotFound);

      const myApply = await this.stayApplyModel.findOne({ user: user._id });
      if (!!myApply) throw new Error(StayError.YouAlreadyApplied);

      await new this.stayApplyModel({
        user: user._id,
        other: location,
      }).save();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "잔류신청에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelStay(userId: string) {
    try {
      const user = await this.userModel
        .findById(userId)
        .populate(UserStudentPopulator);
      if (!user) throw new Error(StayError.UserNotFound);

      const myApply = await this.stayApplyModel.findOne({ user: user._id });
      if (!myApply) throw new Error(StayError.ApplyNotFound);

      await myApply.deleteOne();
      await this.stayGoingOutModel.findOneAndDelete({ stay: myApply._id });

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "잔류신청 취소에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async goingOutApply(
    userId: string,
    mealCancel: MealSchedule[],
    from: string,
    to: string,
    reason: string,
  ) {
    try {
      const user = await this.userModel
        .findById(userId)
        .populate(UserStudentPopulator);
      if (!user) throw new Error(StayError.UserNotFound);

      const myApply = await this.stayApplyModel.findOne({ user: user._id });
      if (!myApply) throw new Error(StayError.ApplyNotFound);

      await new this.stayGoingOutModel({
        user: user._id,
        stay: myApply._id,
        mealCancel,
        from,
        to,
        reason,
      }).save();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "잔류중 외출신청에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async goingOutDelete(userId) {
    try {
      const user = await this.userModel
        .findById(userId)
        .populate(UserStudentPopulator);
      if (!user) throw new Error(StayError.UserNotFound);

      const myApply = await this.stayApplyModel.findOne({ user: user._id });
      if (!myApply) throw new Error(StayError.ApplyNotFound);

      const goingOut = await this.stayGoingOutModel.findOne({
        stay: myApply._id,
      });
      if (!goingOut) throw new Error(StayError.GoingOutApplyNotFound);

      goingOut.deleteOne();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "잔류중 외출신청 취소에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
