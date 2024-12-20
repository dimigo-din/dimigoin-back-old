import type { HydratedDocument } from "mongoose";
import type { Gender, UserType } from "src/common/types";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { GenderValues, UserTypeValues } from "src/common/types";

@Schema({ timestamps: false, versionKey: false })
export class User {
  @Prop({
    required: true,
    type: String,
    minlength: 2,
    maxlength: 4,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
    enum: GenderValues,
  })
  gender: Gender;

  @Prop({
    required: true,
    type: String,
    enum: UserTypeValues,
  })
  type: UserType;

  @Prop({
    required: true,
    type: Number,
    min: 0,
  })
  generation: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
export const UserPopulator = User.name.toLowerCase();
