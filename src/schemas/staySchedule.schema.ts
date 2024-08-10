import type { HydratedDocument } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import {
  Grade,
  StayScheduleApplyDayUnit,
  StayScheduleApplyDayUnitValues,
  StayAtType,
} from "../common/types";

@Schema({ timestamps: false, versionKey: false })
export class StaySchedule {
  @Prop({
    required: true,
    type: String,
  })
  from: string; // yyyyMMdd for specific year, MMdd for every year;

  @Prop({
    required: true,
    type: String,
  })
  to: string;

  @Prop({
    required: true,
    type: [Number],
  })
  grade: Grade[];

  @Prop({
    required: true,
    type: StayScheduleApplyDayUnitValues,
  })
  applyDayUnit: StayScheduleApplyDayUnit;

  @Prop({
    required: true,
    type: String,
  })
  applyFrom: string; // yyyyMMdd or (weekday like monday)

  @Prop({
    required: true,
    type: String,
  })
  applyTo: string;

  @Prop({
    required: true,
    type: [String],
  })
  stayPos: StayAtType[];
}

export const StayScheduleSchema = SchemaFactory.createForClass(StaySchedule);
export type StayScheduleDocument = HydratedDocument<StaySchedule>;
export const StaySchedulePopulator = StaySchedule.name.toLowerCase();
