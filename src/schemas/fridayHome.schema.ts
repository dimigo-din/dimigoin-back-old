import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Types } from "mongoose";

import { User } from "./user.schema";

@Schema({ timestamps: false, versionKey: false })
export class FridayHome {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
  })
  user: string;

  @Prop({
    required: true,
    type: Number,
  })
  month: number;

  @Prop({
    required: true,
    type: Number,
  })
  week: number;

  @Prop({
    required: true,
    type: String,
  })
  reason: string;

  @Prop({
    required: false,
    type: Boolean,
  })
  allowed: boolean;

  @Prop({
    required: false,
    type: String,
  })
  teacherReason: string;
}

export const FridayHomeSchema = SchemaFactory.createForClass(FridayHome);
export type FridayHomeDocument = HydratedDocument<FridayHome>;
