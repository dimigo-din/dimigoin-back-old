import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, type HydratedDocument } from "mongoose";

@Schema({ timestamps: false, versionKey: false })
export class Password {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "User",
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  id: string;

  @Prop({
    required: true,
    type: String,
  })
  password: string;
}

export const PasswordSchema = SchemaFactory.createForClass(Password);
export type PasswordDocument = HydratedDocument<Password>;
