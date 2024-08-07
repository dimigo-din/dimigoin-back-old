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
  DormitoryFloorType,
  DormitoryMachinePosType,
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
  floor: DormitoryFloorType;

  @ApiProperty()
  @IsString()
  pos: DormitoryMachinePosType;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  @IsNumber({}, { each: true })
  allow: number[]; // ref: ../laundryManage.dto.ts

  @ApiProperty({ type: [MachineTimes] })
  times: MachineTimes[];
}

export class ApplyDTO {
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
