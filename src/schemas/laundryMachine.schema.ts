import type { HydratedDocument } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import {
  DormitoryFloor,
  DormitoryFloorValues,
  DormitoryMachinePos,
  DormitoryMachinePosValues,
  Gender,
  GenderValues,
  MachineTypeValues,
} from "../common/types";

@Schema({ timestamps: false, versionKey: false })
export class LaundryMachine {
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
    enum: MachineTypeValues,
  })
  type: string;

  @Prop({
    required: true,
    type: String,
    enum: GenderValues,
  })
  gender: Gender;

  @Prop({
    required: true,
    type: Number,
    enum: DormitoryFloorValues,
  })
  floor: DormitoryFloor;

  @Prop({
    required: true,
    type: String,
    enum: DormitoryMachinePosValues,
  })
  pos: DormitoryMachinePos;

  @Prop({
    required: true,
    type: [Number],
  })
  allow: number[];
}

export const LaundryMachineSchema =
  SchemaFactory.createForClass(LaundryMachine);
export type LaundryMachineDocument = HydratedDocument<LaundryMachine>;
export const LaundryMachinePopulator = LaundryMachine.name.toLowerCase();
