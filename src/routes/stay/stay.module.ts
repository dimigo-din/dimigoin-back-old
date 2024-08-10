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
} from "../../schemas";

import { StayController } from "./stay.controller";
import { StayService } from "./stay.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: StayApply.name, schema: StayApplySchema },
      { name: StaySchedule.name, schema: StayScheduleSchema },
      { name: StaySeat.name, schema: StaySeatSchema },
    ]),
  ],
  controllers: [StayController],
  providers: [StayService],
})
export class StayModule {}
