import type { Class, Grade } from "src/common/types";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, type HydratedDocument } from "mongoose";

import { ClassValues, GradeValues } from "src/common/types";

@Schema({ timestamps: false, versionKey: false })
export class UserStudent {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "User",
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: Number,
    min: 0,
  })
  year: number;

  @Prop({
    required: true,
    type: Number,
    enum: GradeValues,
  })
  grade: Grade;

  @Prop({
    required: true,
    type: Number,
    enum: ClassValues,
  })
  class: Class;

  @Prop({
    required: true,
    type: Number,
    min: 1,
  })
  number: number;
}

export const UserStudentSchema = SchemaFactory.createForClass(UserStudent);
export type UserStudentDocument = HydratedDocument<UserStudent>;
