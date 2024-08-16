import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsString } from "class-validator";

import {
  Grade,
  MealSchedule,
  MealScheduleValues,
  StayAtType,
  StayAtTypeValues,
} from "../../common/types";

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
  @ApiProperty({ enum: StayAtTypeValues })
  @IsString()
  stayLocation: StayAtType;

  @ApiProperty({
    description:
      "in case stayLocation is seat, write studyroom seat _id. and null for class, place name for others",
  })
  @IsString()
  stayLocationDetail: string;
}

export class StayGoingOutApplyDTO {
  @ApiProperty({ type: [String], enum: MealScheduleValues })
  @IsArray()
  mealCancel: MealSchedule[];

  @ApiProperty({ enum: ["sat", "sun"] })
  @IsString()
  day: string;

  @ApiProperty({ description: "format: hhmm" })
  @IsString()
  from: string;

  @ApiProperty({ description: "format: hhmm" })
  @IsString()
  to: string;

  @ApiProperty()
  @IsString()
  reason: string;
}

export class GoingOutCancelDTO {
  @ApiProperty()
  @IsString()
  goingOutId: string;
}

export class CurrentStaySchedule {
  @ApiProperty()
  @IsString()
  nane: string;

  @ApiProperty()
  @IsString()
  from: string;

  @ApiProperty()
  @IsString()
  to: string;

  @ApiProperty()
  stayPos: StayAtType[];

  @ApiProperty()
  @IsString()
  preset: string;
}
