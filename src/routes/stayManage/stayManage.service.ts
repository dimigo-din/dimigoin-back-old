import type { Model } from "mongoose";

import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Excel from "exceljs";
import * as moment from "moment-timezone";

import { ErrorHandler, StayManageError } from "../../common/errors";
import { ClassValues, GradeValues } from "../../common/types";
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

import { StaySeatAddDTO } from "./stayManage.dto";

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

  async list() {
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
        };
      });
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "열람실 좌석 목록을 가져오는데 실패하였습니다.",
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
          return uo.user.equals(a[UserPopulator]._id);
        });

        return {
          _id: a._id,
          uName: a[UserPopulator].name,
          uGender: a[UserPopulator].gender,
          uGrade: userStudent.grade,
          uClass: userStudent.class,
          uNumber: userStudent.number,
          stayLocation: !!a.seat
            ? seats.find((s) => s._id.equals(a.seat))!.seat
            : a.other,
          outGoing: userOutGoing,
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

      console.log(applyStatus);

      const applyGroup = {};
      GradeValues.forEach((g) => {
        applyGroup[g] = {};
        ClassValues.forEach((c) => {
          applyGroup[g][c] = [];
        });
      });
      applyStatus.forEach((a) => {
        applyGroup[a.uGrade][a.uClass].push(a);
      });

      const wb = new Excel.Workbook();
      function makeSheet(day) {
        const sheet = wb.addWorksheet(
          `${moment().year()}년도 ${moment().week()}주차 ${day === "sat" ? "토요일" : "일요일"} 잔류 명단`,
        );
        sheet.addRow([
          "학년",
          "반",
          "인원",
          "잔류자",
          "조식",
          "중식",
          "석식",
          "외출",
        ]);

        let i = 2; // for each line
        let i2 = 2; // for grade displaying
        let i3 = 2; // for class displaying
        Object.keys(applyGroup).forEach((g) => {
          let studentCount = 0;
          Object.keys(applyGroup[g]).forEach((c) => {
            if (applyGroup[g][c].length !== 0) {
              sheet.mergeCells(`B${i}:B${i + applyGroup[g][c].length - 1}`);
              sheet.mergeCells(`C${i}:C${i + applyGroup[g][c].length - 1}`);
            }
            studentCount += applyGroup[g][c].length;
            applyGroup[g][c].forEach((s) => {
              sheet.getCell("D" + i).value =
                `${s.uGrade}${s.uClass}${s.uNumber} ${s.uName}`;
              const outGoing = s.outGoing.find((og) => og.day === day);
              if (!outGoing) {
                sheet.getCell("E" + i).value = "O";
                sheet.getCell("F" + i).value = "O";
                sheet.getCell("G" + i).value = "O";
              } else {
                sheet.getCell("E" + i).value =
                  outGoing.mealCancel.indexOf("breakfast") !== -1 ? "X" : "O";
                sheet.getCell("F" + i).value =
                  outGoing.mealCancel.indexOf("launch") !== -1 ? "X" : "O";
                sheet.getCell("G" + i).value =
                  outGoing.mealCancel.indexOf("dinner") !== -1 ? "X" : "O";
                sheet.getCell("H" + i).value =
                  `${outGoing.from.slice(0, 2) + ":" + outGoing.from.slice(2)}~${outGoing.to.slice(0, 2) + ":" + outGoing.to.slice(2)} (${outGoing.reason})`;
              }
              i++;
            });
            if (i !== i3) {
              sheet.getCell("B" + i3).value = `${c}반`;
              sheet.getCell("C" + i3).value = applyGroup[g][c].length + "명";
            }
            i3 = i;
          });
          if (i !== i2) {
            sheet.mergeCells(`A${i2}:A${i2 + studentCount - 1}`);
            sheet.getCell(`A${i2}`).value = `${g}학년`;
          }
          i2 = i;
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
      }

      makeSheet("sat");
      makeSheet("sun");

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

  async getPreset() {
    try {
      const rawSeats = await this.staySeatModel.find({});

      const seats = {};
      rawSeats.forEach((rs) => {
        if (!seats.hasOwnProperty(rs.preset))
          seats[rs.preset] = { seats: [], active: rs.active };
        seats[rs.preset].seats.push(rs);
      });

      return seats;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "좌석 프리셋을 불러오는데 실패하였습니다.",
      );
    }
  }

  async addPreset(data: StaySeatAddDTO) {
    try {
      await new this.staySeatModel({
        ...data,
        active: false,
      }).save();
      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "좌석 프리셋을 등록하는데 실패하였습니다.",
      );
    }
  }

  async deletePreset(preset: string) {
    try {
      await this.staySeatModel.deleteMany({ preset: preset });
      return true;
    } catch (error) {
      console.log(error);
      ErrorHandler(
        StayManageError,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "좌석 프리셋을 삭제하는데 실패하였습니다.",
      );
    }
  }

  async activePreset(preset: string) {
    try {
      await this.staySeatModel.updateMany(
        {},
        {
          $set: {
            active: false,
          },
        },
      );
      await this.staySeatModel.updateMany(
        {
          preset,
        },
        {
          $set: {
            active: true,
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
        "좌석 프리셋을 활성화하는데 실패하였습니다.",
      );
    }
  }
}
