import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument } from "mongoose";

@Schema({ timestamps: false, versionKey: false })
export class Token {
  @Prop({
    required: true,
  })
  refreshToken: string;

  @Prop({
    required: true,
  })
  user: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
export type TokenDocument = HydratedDocument<Token>;
