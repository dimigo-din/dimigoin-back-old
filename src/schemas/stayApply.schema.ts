import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Types } from "mongoose";

import { StaySeat } from "./staySeat.schema";
import { User } from "./user.schema";

@Schema({ timestamps: false, versionKey: false })
export class StayApply {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
  })
  user: Types.ObjectId;

  @Prop({
    required: false,
    type: Types.ObjectId,
    ref: StaySeat.name,
  })
  seat: Types.ObjectId;

  @Prop({
    required: false,
    type: String,
  })
  other: string; // Like KT
}

export const StayApplySchema = SchemaFactory.createForClass(StayApply);
export type StayApplyDocument = HydratedDocument<StayApply>;
export const StayApplyPopulator = StayApply.name.toLowerCase();
