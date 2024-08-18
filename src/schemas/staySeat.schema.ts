// 좌석 등록할때 해당 좌석이 Rule에 위반되지 않을경우, 통과, 아니면 백
import type { HydratedDocument } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Gender, Grade } from "../common/types";

@Schema({ timestamps: false, versionKey: false })
export class StaySeat {
  @Prop({
    required: true,
    type: String,
  })
  seat: string;

  @Prop({
    required: true,
    type: [Number],
  })
  grade: Grade[];

  @Prop({
    required: true,
    type: [String],
  })
  gender: Gender[];

  @Prop({
    required: true,
    type: String,
  })
  preset: string; // default

  @Prop({
    required: true,
    type: Boolean,
  })
  active: boolean;
}

export const StaySeatSchema = SchemaFactory.createForClass(StaySeat);
export type StaySeatDocument = HydratedDocument<StaySeat>;
export const StaySeatPopulator = StaySeat.name.toLowerCase();
