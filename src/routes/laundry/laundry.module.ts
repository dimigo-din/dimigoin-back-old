import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import {
  LaundryMachine,
  LaundryMachineSchema,
  User,
  UserSchema,
  LaundryApply,
  LaundryApplySchema,
  LaundryTimetable,
  LaundryTimetableSchema,
} from "../../schemas";

import { LaundryController } from "./laundry.controller";
import { LaundryService } from "./laundry.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: LaundryMachine.name, schema: LaundryMachineSchema },
      { name: LaundryApply.name, schema: LaundryApplySchema },
      { name: LaundryTimetable.name, schema: LaundryTimetableSchema },
    ]),
  ],
  controllers: [LaundryController],
  providers: [LaundryService],
})
export class LaundryModule {}
