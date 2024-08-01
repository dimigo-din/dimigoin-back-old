import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Types } from "mongoose";

import { RateLimitTypeValues } from "../common/types";

@Schema({ timestamps: false, versionKey: false })
export class RateLimit {
  @Prop({
    required: true,
    type: String,
    enum: RateLimitTypeValues,
  })
  type: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "User",
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: Number,
  })
  time: number;
}

export const RateLimitSchema = SchemaFactory.createForClass(RateLimit);
export type RateLimitDocument = HydratedDocument<RateLimit>;
