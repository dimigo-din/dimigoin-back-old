import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Types } from "mongoose";

import { MealSchedule } from "../common/types";

import { StayApply } from "./stayApply.schema";
import { User } from "./user.schema";

@Schema({ timestamps: false, versionKey: false })
export class StayGoingOut {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: StayApply.name,
  })
  stay: Types.ObjectId;

  @Prop({
    required: true,
    type: [String],
  })
  mealCancel: MealSchedule[];

  @Prop({
    required: true,
    type: String,
  })
  day: string;

  @Prop({
    required: true,
    type: String,
  })
  from: string;

  @Prop({
    required: true,
    type: String,
  })
  to: string;

  @Prop({
    required: true,
    type: String,
  })
  reason: string;

  @Prop({
    required: false,
    type: Boolean,
  })
  approved: boolean;
}

export const StayGoingOutSchema = SchemaFactory.createForClass(StayGoingOut);
export type StayGoingOutDocument = HydratedDocument<StayGoingOut>;
export const StayGoingOutPopulator = StayGoingOut.name.toLowerCase();
