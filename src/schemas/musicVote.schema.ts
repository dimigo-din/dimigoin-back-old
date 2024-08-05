import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ timestamps: false, versionKey: false })
export class MusicVote {
  @Prop({
    required: true,
    type: String,
  })
  week: string;
  @Prop({
    required: true,
    type: String,
  })
  day: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "User",
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "MusicList",
  })
  target: Types.ObjectId;

  @Prop({
    required: true,
    type: Boolean,
  })
  isUpVote: boolean;
}

export const MusicVoteSchema = SchemaFactory.createForClass(MusicVote);
export type MusicVoteDocument = HydratedDocument<MusicVote>;
