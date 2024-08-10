import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

import { Grade, StayAtType } from "../../common/types";

export class SeatDTO {
  @ApiProperty()
  @IsString()
  _id: string;

  @ApiProperty()
  @IsString()
  seat: string;

  @ApiProperty()
  grade: Grade | null;
}

export class SeatListDTO extends SeatDTO {
  @ApiProperty()
  @IsBoolean()
  isApplied: boolean;

  @ApiProperty()
  @IsString()
  applierId: string;

  @ApiProperty()
  @IsString()
  applierName: string;

  @ApiProperty()
  @IsBoolean()
  isMine: boolean;
}

export class StayApplyDTO {
  @ApiProperty()
  @IsString()
  stayLocation: StayAtType;

  @ApiProperty({
    description:
      "in case stayLocation is seat, write studyroom seat _id. and null for class, place name for others",
  })
  @IsString()
  stayLocationDetail: string;
}
