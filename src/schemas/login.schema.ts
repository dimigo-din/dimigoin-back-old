import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, type HydratedDocument } from "mongoose";

import { type LoginType, LoginTypeValues } from "src/common/types";

import { User } from "./user.schema";

@Schema({ timestamps: false, versionKey: false })
export class Login {
  @Prop({
    required: true,
    type: String,
    enum: LoginTypeValues,
  })
  type: LoginType;

  @Prop({
    required: true,
    type: String,
  })
  value: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
  })
  user: Types.ObjectId;
}

export const LoginSchema = SchemaFactory.createForClass(Login);
export type LoginDocument = HydratedDocument<Login>;
