import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  IsNumber,
  IsBoolean,
} from "class-validator";

import {
  DormitoryFloor,
  DormitoryMachinePos,
  Gender,
  MachineType,
} from "../../common/types";

export class MachineTimes {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  time: string;

  @ApiProperty()
  @IsBoolean()
  isApplied: boolean;

  @ApiProperty()
  @IsBoolean()
  isMine: boolean;

  @ApiProperty()
  @IsString()
  applierId: string;

  @ApiProperty()
  @IsString()
  applierName: string;
}

export class MachineListDTO {
  @ApiProperty()
  @IsString()
  _id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  gender: Gender;

  @ApiProperty()
  @IsNumber()
  floor: DormitoryFloor;

  @ApiProperty()
  @IsString()
  pos: DormitoryMachinePos;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  @IsNumber({}, { each: true })
  allow: number[]; // ref: ../laundryManage.dto.ts

  @ApiProperty({ type: [MachineTimes] })
  times: MachineTimes[];
}

export class LaundryApplyDTO {
  @ApiProperty()
  @IsString()
  target: string;

  @ApiProperty()
  @IsString()
  time: string;
}

export class ApplyCancelDTO {
  @ApiProperty()
  @IsString()
  target: MachineType;
}
