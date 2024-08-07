import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { LaundryTable, LaundryTableSchema } from "../../schemas";
import {
  LaundryTimetable,
  LaundryTimetableSchema,
} from "../../schemas/laundryTimetable.schema";

import { LaundryManageController } from "./laundryManage.controller";
import { LaundryManageService } from "./laundryManage.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LaundryTable.name, schema: LaundryTableSchema },
      { name: LaundryTimetable.name, schema: LaundryTimetableSchema },
    ]),
  ],
  controllers: [LaundryManageController],
  providers: [LaundryManageService],
})
export class LaundryManageModule {}
