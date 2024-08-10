import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Types } from "mongoose";

import { User } from "./user.schema";

@Schema({ timestamps: false, versionKey: false })
export class Token {
  @Prop({
    required: true,
    type: String,
  })
  refreshToken: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
  })
  user: Types.ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
export type TokenDocument = HydratedDocument<Token>;
export const TokenPopulator = Token.name.toLowerCase();
