import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument } from "mongoose";

import { MachineType } from "../common/types";

@Schema({ timestamps: false, versionKey: false })
export class LaundryTimetable {
  @Prop({
    required: true,
  })
  type: MachineType;

  @Prop({
    required: true,
    type: String,
  })
  time: string;

  @Prop({
    required: true,
    type: [Number],
  })
  available: number[]; // [0, 0, 0, 0, 0, 1, 1] 일주일 가능한 요일선택
}

export const LaundryTimetableSchema =
  SchemaFactory.createForClass(LaundryTimetable);
export type LaundryTimetableDocument = HydratedDocument<LaundryTimetable>;
