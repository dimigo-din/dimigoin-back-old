import type { HydratedDocument } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Grade, StayScheduleDayUnit, StayAtType } from "../common/types";

@Schema({ timestamps: false, versionKey: false })
export class StaySchedule {
  @Prop({
    required: true,
    type: String,
  })
  dayUnit: StayScheduleDayUnit;

  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
  })
  from: string; // yyyyMMDDThhmm for specific year, MMDDThhmm for every year or (weekday like mon, tue.. etc)

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
    type: String,
  })
  applyFrom: string; // yyyyMMDDThhmm or (weekday like mon, tue.. etc)

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

  @Prop({
    required: true,
    type: Number,
  })
  priority: number;

  @Prop({
    required: true,
    type: String,
  })
  preset: string;
}

export const StayScheduleSchema = SchemaFactory.createForClass(StaySchedule);
export type StayScheduleDocument = HydratedDocument<StaySchedule>;
export const StaySchedulePopulator = StaySchedule.name.toLowerCase();
