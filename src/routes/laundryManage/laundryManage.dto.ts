import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsNumber } from "nestjs-swagger-dto";

import {
  DormitoryFloorType,
  DormitoryMachinePosType,
  Gender,
  MachineType,
} from "../../common/types";

export class MachineApplyDTO {
  @ApiProperty()
  @IsString()
  gender: Gender;

  @ApiProperty()
  @IsNumber()
  floor: DormitoryFloorType;

  @ApiProperty()
  @IsString()
  pos: DormitoryMachinePosType;

  @ApiProperty()
  @IsString()
  machineType: MachineType;
}

export class MachineDeleteDTO {
  @ApiProperty()
  @IsString()
  id: string;
}
