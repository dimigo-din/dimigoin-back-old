import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import {
  User,
  UserSchema,
  StaySchedule,
  StayScheduleSchema,
  StayApply,
  StayApplySchema,
  StaySeat,
  StaySeatSchema,
  UserStudent,
  UserStudentSchema,
} from "../../schemas";

import { StayManageController } from "./stayManage.controller";
import { StayManageService } from "./stayManage.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserStudent.name, schema: UserStudentSchema },
      { name: StayApply.name, schema: StayApplySchema },
      { name: StaySchedule.name, schema: StayScheduleSchema },
      { name: StaySeat.name, schema: StaySeatSchema },
    ]),
  ],
  controllers: [StayManageController],
  providers: [StayManageService],
})
export class StayManageModule {}
