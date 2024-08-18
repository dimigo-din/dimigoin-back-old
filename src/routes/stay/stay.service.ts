import type { Model } from "mongoose";

import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as moment from "moment-timezone";

import { ErrorHandler, StayError } from "../../common/errors";
import {
  MealSchedule,
  StayAtType,
  Weekday,
  WeekdayValues,
} from "../../common/types";
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
  UserStudent,
  UserStudentDocument,
} from "../../schemas";

@Injectable()
export class StayService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(UserStudent.name)
    private readonly userStudentModel: Model<UserStudentDocument>,
    @InjectModel(StayApply.name)
    private readonly stayApplyModel: Model<StayApplyDocument>,
    @InjectModel(StaySchedule.name)
    private readonly stayScheduleModel: Model<StayScheduleDocument>,
    @InjectModel(StaySeat.name)
    private readonly staySeatModel: Model<StaySeatDocument>,
    @InjectModel(StayGoingOut.name)
    private readonly stayGoingOutModel: Model<StayGoingOutDocument>,
  ) {}

  async checkSchedule(userId: string, stayLocation: StayAtType) {
    const today = moment();

    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new Error(StayError.UserNotFound);

      const userStudent = await this.userStudentModel.findOne({
        user: user._id,
      });
      if (!userStudent) throw new Error(StayError.UserNotFound);

      const schedule = (await this.stayScheduleModel.find({}))
        .sort((s1, s2) => {
          return s2.priority - s1.priority;
        })
        .filter((s) => {
          if (s.dayUnit === "date") return moment(s.to).isBefore(today);
          if (s.dayUnit === "weekday") return true;
        })[0];

      console.log(schedule);

      if (!schedule) throw new Error();

      if (schedule.grade.indexOf(userStudent.grade) === -1)
        throw new Error(StayError.DisAllowedGradeApply);

      if (schedule.stayPos.indexOf(stayLocation) === -1)
        throw new Error(StayError.IllegalStayLocation);

      if (schedule.dayUnit === "date") {
        if (moment(schedule.applyFrom).isBefore(today))
          throw new Error(StayError.BeforeApply);
        if (moment(schedule.applyTo).isAfter(today))
          throw new Error(StayError.AfterApply);
        return {
          name: schedule.name,
          from: schedule.from,
          to: schedule.to,
          stayPos: schedule.stayPos,
          preset: schedule.preset,
        };
      } else if (schedule.dayUnit === "weekday") {
        console.log(WeekdayValues.indexOf(schedule.applyFrom as Weekday));
        console.log(today.day() - 1);
        if (
          WeekdayValues.indexOf(schedule.applyFrom as Weekday) <=
            today.day() - 1 &&
          today.day() - 1 <= WeekdayValues.indexOf(schedule.applyTo as Weekday)
        )
          return {
            name: schedule.name,
            from: schedule.from,
            to: schedule.to,
            stayPos: schedule.stayPos,
            preset: schedule.preset,
          };
        else throw new Error();
      } else throw new Error(StayError.IllegalStayScheduleApplyDayUnit);
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "현재 잔류신청 기간이 아닙니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
          gender: s.gender,
          isApplied: !!thisApply,
          ...(!!thisApply
            ? {
                applyId: thisApply._id,
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
      const user = await this.userModel.findById(userId);
      if (!user) throw new Error(StayError.UserNotFound);

      const userStudent = await this.userStudentModel.findOne({
        user: user._id,
      });
      if (!userStudent) throw new Error(StayError.UserNotFound);

      const myApply = await this.stayApplyModel.findOne({ user: user._id });
      if (!!myApply) throw new Error(StayError.YouAlreadyApplied);

      const apply = await this.stayApplyModel.findOne({ seat: seatId });
      if (!!apply) throw new Error(StayError.SeatAlreadyApplied);

      const seat = await this.staySeatModel.findById(seatId);
      if (!seat) throw new Error(StayError.SeatNotFound);

      if (seat.toJSON().grade.indexOf(userStudent.grade) === -1)
        throw new Error(StayError.DisAllowedGradeSeat);

      if (seat.toJSON().gender.indexOf(user.gender) === -1)
        throw new Error(StayError.DisAllowedGenderSeat);

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
      const user = await this.userModel.findById(userId);
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
      const user = await this.userModel.findById(userId);
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
      const user = await this.userModel.findById(userId);
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

  async goingOutList(userId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new Error(StayError.UserNotFound);

      const goingOut = await this.stayGoingOutModel.find({ user: user._id });

      return goingOut.map((g) => {
        return {
          _id: g._id,
          mealCancel: g.mealCancel,
          day: g.day,
          from: g.from,
          to: g.to,
          reason: g.reason,
          approved: g.approved,
        };
      });
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "외출신청 목록을 불러오는데 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async goingOutApply(
    userId: string,
    mealCancel: MealSchedule[],
    day: string,
    from: string,
    to: string,
    reason: string,
  ) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new Error(StayError.UserNotFound);

      const myApply = await this.stayApplyModel.findOne({ user: user._id });
      if (!myApply) throw new Error(StayError.ApplyNotFound);

      await new this.stayGoingOutModel({
        user: user._id,
        stay: myApply._id,
        mealCancel,
        day,
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

  async goingOutDelete(userId, outGoingId) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new Error(StayError.UserNotFound);

      const myApply = await this.stayApplyModel.findOne({ user: user._id });
      if (!myApply) throw new Error(StayError.ApplyNotFound);

      const goingOut = await this.stayGoingOutModel.findOne({
        _id: outGoingId,
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
