import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsArray,
  IsNumber,
  ArrayMinSize,
  ArrayMaxSize,
} from "class-validator";

import {
  DormitoryFloorType,
  DormitoryFloorValues,
  DormitoryMachinePosType,
  DormitoryMachinePosValues,
  Gender,
  GenderValues,
  MachineType,
  MachineTypeValues,
} from "../../common/types";

export class MachineDTO {
  @ApiProperty({ type: GenderValues })
  @IsString()
  gender: Gender;

  @ApiProperty({ type: DormitoryFloorValues })
  @IsNumber()
  floor: DormitoryFloorType;

  @ApiProperty({ type: DormitoryMachinePosValues })
  @IsString()
  pos: DormitoryMachinePosType;

  @ApiProperty({ type: MachineTypeValues })
  @IsString()
  machineType: MachineType;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  @IsNumber({}, { each: true })
  allow: number[]; // like, [1, 1, 1, 1, 1, 7, 7] 1st bit grade 3, 3rd bit grade 1. 7 equals all grade, 2 equals 2nd grade, 3 equals 1st and 2nd grade.
}

export class MachineDeleteDTO {
  @ApiProperty()
  @IsString()
  id: string;
}

export class LaundryTimeDTO {
  @ApiProperty({ type: MachineTypeValues })
  @IsString()
  type: MachineType;

  @ApiProperty()
  @IsString()
  time: string;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  @IsNumber({}, { each: true })
  available: number[];
}

export class LaundryTimeDeleteDTO {
  @ApiProperty()
  @IsString()
  id: string;
}
