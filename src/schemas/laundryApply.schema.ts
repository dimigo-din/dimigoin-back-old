import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, type HydratedDocument } from "mongoose";

import { LaundryTable } from "./laundryTable.schema";
import { LaundryTimetable } from "./laundryTimetable.schema";
import { User } from "./user.schema";

@Schema({ timestamps: false, versionKey: false })
export class LaundryApply {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: LaundryTable.name,
  })
  target: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: LaundryTimetable.name,
  })
  time: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
  })
  user: Types.ObjectId;
}

export const LaundryApplySchema = SchemaFactory.createForClass(LaundryApply);
export type LaundryApplyDocument = HydratedDocument<LaundryApply>;
