import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import {
  LaundryApply,
  LaundryApplySchema,
  LaundryMachine,
  LaundryMachineSchema,
  LaundryTimetable,
  LaundryTimetableSchema,
  User,
  UserSchema,
  UserStudent,
  UserStudentSchema,
} from "../../schemas";

import { LaundryManageController } from "./laundryManage.controller";
import { LaundryManageService } from "./laundryManage.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserStudent.name, schema: UserStudentSchema },
      { name: LaundryApply.name, schema: LaundryApplySchema },
      { name: LaundryMachine.name, schema: LaundryMachineSchema },
      { name: LaundryTimetable.name, schema: LaundryTimetableSchema },
    ]),
  ],
  controllers: [LaundryManageController],
  providers: [LaundryManageService],
})
export class LaundryManageModule {}
