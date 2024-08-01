// import type { HydratedDocument } from "mongoose";
//
// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
//
// import {
//   DormitoryTypeValues,
//   HakBongFloorValues,
//   LoginTypeValues,
//   WooJeongFloorValues,
// } from "../common/types";
//
// @Schema({ timestamps: false, versionKey: false })
// export class LaundryTable {
//   @Prop({
//     required: true,
//     type: String,
//   })
//   name: string;
//
//   @Prop({
//     required: true,
//     type: Number,
//     enum: DormitoryTypeValues,
//   })
//   type: string;
//
//   @Prop({
//     required: true,
//     type: Number,
//   })
//   floor: string;
// }
//
// export const LaundryTableSchema = SchemaFactory.createForClass(LaundryTable);
// export type LaundryTableDocument = HydratedDocument<LaundryTable>;
