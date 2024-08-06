import type { Model } from "mongoose";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { ErrorHandler, LaundryManageError } from "../../common/errors";
import {
  DormitoryFloorType,
  DormitoryMachinePosType,
  DormitoryMachinePosValues,
  Gender,
  GenderValues,
  Grade,
  GradeValues,
  MachineType,
  MachineTypeValues,
} from "../../common/types";
import { LaundryTable, LaundryTableDocument } from "../../schemas";

@Injectable()
export class LaundryManageService {
  constructor(
    @InjectModel(LaundryTable.name)
    private laundryTableModel: Model<LaundryTableDocument>,
  ) {}

  async apply(
    gender: Gender,
    floor: DormitoryFloorType,
    pos: DormitoryMachinePosType,
    machineType: MachineType,
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
      }).save();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(LaundryManageError, error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        "기기 등록에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id) {
    try {
      const machine = await this.laundryTableModel.findById(id);
      if (!machine) throw new Error(LaundryManageError.MachineNotFound);

      await machine.deleteOne();
      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(LaundryManageError, error, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        "기기 삭제에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
