import type { Model } from "mongoose";

import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as moment from "moment-timezone";

import { ErrorHandler, LaundryManageError } from "../../common/errors";
import {
  DormitoryFloor,
  DormitoryMachinePos,
  DormitoryMachinePosValues,
  Gender,
  GenderValues,
  MachineType,
  MachineTypeValues,
} from "../../common/types";
import {
  LaundryMachine,
  LaundryMachineDocument,
  LaundryTimetable,
  LaundryTimetableDocument,
} from "../../schemas";

import { LaundryTimeDTO } from "./laundryManage.dto";

@Injectable()
export class LaundryManageService {
  constructor(
    @InjectModel(LaundryMachine.name)
    private laundryTableModel: Model<LaundryMachineDocument>,
    @InjectModel(LaundryTimetable.name)
    private laundryTimetableModel: Model<LaundryTimetableDocument>,
  ) {}

  async machineList() {
    try {
      return await this.laundryTableModel.find({});
    } catch (error) {
      console.log(error);
      ErrorHandler(
        LaundryManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "기기 목록을 불러오는데 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async machineApply(
    gender: Gender,
    floor: DormitoryFloor,
    pos: DormitoryMachinePos,
    machineType: MachineType,
    allow: number[],
  ) {
    try {
      if (!GenderValues.includes(gender))
        throw new Error(LaundryManageError.InvalidGender);

      const floorAvailable = gender === "M" ? [2, 3, 4, 5] : [1, 2, 3];
      if (!floorAvailable.includes(floor))
        throw new Error(LaundryManageError.InvalidFloor);

      if (!DormitoryMachinePosValues.includes(pos))
        throw new Error(LaundryManageError.InvalidPos);

      if (!MachineTypeValues.includes(machineType))
        throw new Error(LaundryManageError.InvalidMachine);

      const name = `${gender === "M" ? "학봉관" : "우정학사"} ${floor}층 ${pos === "L" ? "좌측" : pos === "M" ? "중앙" : pos === "R" ? "우측" : ""}${pos === "D" ? "" : " "}${machineType === "washer" ? "세탁기" : "건조기"}`;

      await new this.laundryTableModel({
        name,
        gender,
        floor,
        pos,
        type: machineType,
        allow,
      }).save();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        LaundryManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "기기 등록에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async machineDelete(id: string) {
    try {
      const machine = await this.laundryTableModel.findById(id);
      if (!machine) throw new Error(LaundryManageError.MachineNotFound);

      await machine.deleteOne();
      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        LaundryManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "기기 삭제에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async timeList() {
    try {
      return await this.laundryTimetableModel.find({});
    } catch (error) {
      console.log(error);
      ErrorHandler(
        LaundryManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "세탁 스케줄 목록을 불러오는데 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async timeApply(laundryTime: LaundryTimeDTO) {
    try {
      if (!MachineTypeValues.includes(laundryTime.type))
        throw new Error(LaundryManageError.InvalidMachine);

      if (!moment(laundryTime.time, "HH:mm", true).isValid())
        throw new Error(LaundryManageError.InvalidTimeFormat);

      if (!laundryTime.available.every((w: number) => w === 0 || w === 1))
        throw new Error(LaundryManageError.InvalidWeekdayFormat);

      const result = await new this.laundryTimetableModel({
        type: laundryTime.type,
        time: laundryTime.time,
        available: laundryTime.available,
      }).save();
      console.log(result);
      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        LaundryManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "세탁 스케줄 등록에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async timeDelete(id: string) {
    try {
      const time = await this.laundryTimetableModel.findById(id);
      if (!time) throw new Error(LaundryManageError.TimeNotFound);

      await time.deleteOne();
      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        LaundryManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "스케줄 삭제에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
