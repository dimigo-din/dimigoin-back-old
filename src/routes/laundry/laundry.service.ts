import type { Model } from "mongoose";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as moment from "moment-timezone";

import { ErrorHandler, LaundryError } from "../../common/errors";
import {
  LaundryMachine,
  LaundryMachineDocument,
  User,
  UserDocument,
  LaundryApply,
  LaundryApplyDocument,
  LaundryTimetable,
  LaundryTimetableDocument,
} from "../../schemas";

@Injectable()
export class LaundryService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(LaundryMachine.name)
    private readonly laundryMachineModel: Model<LaundryMachineDocument>,
    @InjectModel(LaundryTimetable.name)
    private readonly laundryTimetableModel: Model<LaundryTimetableDocument>,
    @InjectModel(LaundryApply.name)
    private readonly laundryApplyModel: Model<LaundryApplyDocument>,
  ) {}

  async list(user) {
    const weekday = moment().weekday();

    try {
      const machines = await this.laundryMachineModel.find({
        gender: user.gender,
      });

      const machineAvailable = machines.filter(
        (m) =>
          (m.allow[weekday] >>> 0).toString(2).charAt(3 - user.grade) === "1",
      );

      const applies = await this.laundryApplyModel
        .find({})
        .populate(User.name.toLowerCase());
      const times = await this.laundryTimetableModel.find({});
      return machineAvailable.map((m) => {
        return {
          ...m.toJSON(),
          times: times
            .filter((t) => t.type === m.type)
            .map((t) => {
              const thisApply = applies.find(
                (a) => a.target.equals(m._id) && a.time.equals(t._id),
              );
              const uSchema = User.name.toLowerCase();
              return !!thisApply
                ? {
                    ...t.toJSON(),
                    isApplied: true,
                    isMine: thisApply[uSchema]._id.equals(user._id),
                    applierId: thisApply[uSchema]._id,
                    applierName: thisApply[uSchema].name,
                  }
                : { ...t.toJSON(), isApplied: false };
            }),
        };
      });
    } catch (error) {
      console.log(error);
      ErrorHandler(LaundryError, error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        "기기 리스트를 불러오는데 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async apply(userId, machineId, timeId) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new Error(LaundryError.UserNotFound);

      const machine = await this.laundryMachineModel.findById(machineId);
      if (!machine) throw new Error(LaundryError.MachineNotFound);

      const time = await this.laundryTimetableModel.findById(timeId);
      if (!time) throw new Error(LaundryError.TimeNotFound);

      await new this.laundryApplyModel({
        target: machine._id,
        time: time._id,
        user: user._id,
      }).save();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(LaundryError, error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        "세탁 신청에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancel(userId, target) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new Error(LaundryError.UserNotFound);

      const apply = await this.laundryApplyModel.findOne({
        user: user._id,
        target,
      });
      if (!apply) throw new Error(LaundryError.ApplyNotFound);

      apply.deleteOne();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(LaundryError, error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        "세탁 신청 취소에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}