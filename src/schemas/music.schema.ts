import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Types } from "mongoose";

@Schema({ timestamps: false, versionKey: false })
export class Music {
  @Prop({
    required: true,
    type: String,
  })
  videoId: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "User",
  })
  user: Types.ObjectId;
}

export const MusicSchema = SchemaFactory.createForClass(Music);
export type MusicDocument = HydratedDocument<Music>;
