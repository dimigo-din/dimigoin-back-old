import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

import { MachineType } from "../../common/types";

export class MyLaundryDTO {
  @ApiProperty()
  @IsString()
  _id: string;

  @ApiProperty()
  @IsString()
  machineId: string;

  @ApiProperty()
  @IsString()
  timeId: string;

  @ApiProperty()
  @IsString()
  machine: string;

  @ApiProperty()
  @IsString()
  time: string;

  @ApiProperty()
  @IsString()
  type: MachineType;
}

export class MyStayDTO {
  @ApiProperty()
  @IsString()
  _id: string;

  @ApiProperty()
  @IsString()
  seat: string;

  @ApiProperty()
  @IsBoolean()
  isGoingOut: boolean;

  @ApiProperty()
  @IsString()
  from: string;

  @ApiProperty()
  @IsString()
  to: string;

  @ApiProperty()
  @IsString()
  reason: string;
}
