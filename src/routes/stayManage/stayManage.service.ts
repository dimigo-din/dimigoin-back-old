import type { Model } from "mongoose";

import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Excel from "exceljs";
import * as moment from "moment-timezone";

import { ErrorHandler, StayError, StayManageError } from "../../common/errors";
import { ClassValues, GenderValues, GradeValues } from "../../common/types";
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
export class StayManageService {
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

  async listSchedule() {
    try {
      const schedules = await this.stayScheduleModel.find({});
      return schedules;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "잔류일정을 불러오는데 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getStayStatus() {
    try {
      const seats = await this.staySeatModel.find({});
      const applies = await this.stayApplyModel
        .find({})
        .populate(UserPopulator);
      if (!applies) return [];

      const userStudents = await this.userStudentModel.find({});
      const userOutGoings = await this.stayGoingOutModel.find({});

      return applies.map((a) => {
        const userStudent = userStudents.find((us) =>
          a[UserPopulator]._id.equals(us.user),
        )!;
        const userOutGoing = userOutGoings.filter((uo) => {
          a[UserPopulator]._id.equals(uo.user);
        });
        return {
          _id: a._id,
          uName: a[UserPopulator].name,
          uGender: a[UserPopulator].gender,
          uGrade: userStudent.grade,
          uClass: userStudent.class,
          stayLocation: !!a.seat
            ? seats.find((s) => s._id.equals(a.seat))!.seat
            : a.other,
          outGoing: userOutGoing.length !== 0 ? userOutGoing : [],
        };
      });
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "잔류 현황을 불러오는데 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async downloadStayStatus(res) {
    try {
      const applyStatus = (await this.getStayStatus()) || [];

      const applyGroup = {};
      GradeValues.forEach((g) => {
        applyGroup[g] = {};
        ClassValues.forEach((c) => {
          applyGroup[g][c] = {};
          GenderValues.forEach((ge) => {
            applyGroup[g][c][ge] = [];
          });
        });
      });
      applyStatus.forEach((a) => {
        applyGroup[a.uGrade][a.uClass][a.uGender].push(a);
      });

      const wb = new Excel.Workbook();
      const sheet = wb.addWorksheet(
        `${moment().year()}년도 ${moment().week()}주차 잔류 명단`,
      );
      sheet.addRow(["학년", "반", "인원", "성별", "잔류자", "비고"]);

      let i = 2;
      Object.keys(applyGroup).forEach((g) => {
        sheet.mergeCells(`A${i}:A${i + 11}`);
        sheet.getCell(`A${i}`).value = `${g}학년`;
        Object.keys(applyGroup[g]).forEach((c) => {
          sheet.mergeCells(`B${i}:B${i + 1}`);
          sheet.getCell("B" + i).value = `${c}반`;
          sheet.mergeCells(`C${i}:C${i + 1}`);
          sheet.getCell("C" + i).value =
            applyGroup[g][c].M.length + applyGroup[g][c].F.length + "명";
          Object.keys(applyGroup[g][c]).forEach((ge) => {
            sheet.getCell("D" + i).value = ge === "M" ? "남" : "여";
            sheet.getCell("E" + i).value = "";
            applyGroup[g][c][ge].forEach((apply) => {
              sheet.getCell("E" + i).value += apply.uName + " ";
              sheet.getCell("E" + i);
            });
            i++;
          });
        });
      });

      sheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
          };
        });
      });
      sheet.columns.forEach(function (column) {
        let maxLength = 0;
        column["eachCell"]!({ includeEmpty: true }, function (cell) {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength;
      });

      res.setHeader("Content-Type", "application/vnd.openxmlformats");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" +
          encodeURI(
            `${moment().year()}년도 ${moment().week()}주차 잔류 명단.xlsx`,
          ),
      );

      await wb.xlsx.write(res);
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "잔류 현황을 다운로드하는데 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async applySeat(userId: string, seatId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new Error(StayManageError.UserNotFound);

      const userStudent = await this.userStudentModel.findOne({
        user: user._id,
      });
      if (!userStudent) throw new Error(StayManageError.UserNotFound);

      const myApply = await this.stayApplyModel.findOne({ user: user._id });
      if (!!myApply) throw new Error(StayManageError.YouAlreadyApplied);

      const apply = await this.stayApplyModel.findOne({ seat: seatId });
      if (!!apply) throw new Error(StayManageError.SeatAlreadyApplied);

      const seat = await this.staySeatModel.findById(seatId);
      if (!seat) throw new Error(StayManageError.SeatNotFound);

      await new this.stayApplyModel({
        user: user._id,
        seat: seat._id,
      }).save();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayManageError,
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
      if (!user) throw new Error(StayManageError.UserNotFound);

      const myApply = await this.stayApplyModel.findOne({ user: user._id });
      if (!!myApply) throw new Error(StayManageError.YouAlreadyApplied);

      await new this.stayApplyModel({
        user: user._id,
        other: "class",
      }).save();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayManageError,
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
      if (!user) throw new Error(StayManageError.UserNotFound);

      const myApply = await this.stayApplyModel.findOne({ user: user._id });
      if (!!myApply) throw new Error(StayManageError.YouAlreadyApplied);

      await new this.stayApplyModel({
        user: user._id,
        other: location,
      }).save();

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayManageError,
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
      if (!user) throw new Error(StayManageError.UserNotFound);

      const myApply = await this.stayApplyModel.findOne({ user: user._id });
      if (!myApply) throw new Error(StayManageError.ApplyNotFound);

      await myApply.deleteOne();
      await this.stayGoingOutModel.findOneAndDelete({ stay: myApply._id });

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "잔류신청 취소에 실패하였습니다.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async approveGoingOut(goingOutId) {
    try {
      const goingOut = this.stayGoingOutModel.findById(goingOutId);
      if (!goingOut) throw new Error(StayManageError.GoingOutNotFound);

      await this.stayGoingOutModel.updateOne(
        {
          _id: goingOutId,
        },
        {
          $set: {
            approved: true,
          },
        },
      );

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "외출신청을 허가하는데 실패하였습니다.",
      );
    }
  }

  async denyGoingOut(goingOutId) {
    try {
      const goingOut = this.stayGoingOutModel.findById(goingOutId);
      if (!goingOut) throw new Error(StayManageError.GoingOutNotFound);

      await this.stayGoingOutModel.updateOne(
        {
          _id: goingOutId,
        },
        {
          $set: {
            approved: false,
          },
        },
      );

      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "외출신청을 반려하는데 실패하였습니다.",
      );
    }
  }
}
