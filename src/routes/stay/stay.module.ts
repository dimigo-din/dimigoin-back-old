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
  StayGoingOut,
  StayGoingOutSchema,
  UserStudent,
  UserStudentSchema,
} from "../../schemas";

import { StayController } from "./stay.controller";
import { StayService } from "./stay.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserStudent.name, schema: UserStudentSchema },
      { name: StayApply.name, schema: StayApplySchema },
      { name: StaySchedule.name, schema: StayScheduleSchema },
      { name: StaySeat.name, schema: StaySeatSchema },
      { name: StayGoingOut.name, schema: StayGoingOutSchema },
    ]),
  ],
  controllers: [StayController],
  providers: [StayService],
})
export class StayModule {}
