import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Types } from "mongoose";

@Schema({ timestamps: false, versionKey: false })
export class MusicList {
  @Prop({
    required: true,
    type: Number,
  })
  week: number;

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

export const MusicListSchema = SchemaFactory.createForClass(MusicList);
export type MusicListDocument = HydratedDocument<MusicList>;
