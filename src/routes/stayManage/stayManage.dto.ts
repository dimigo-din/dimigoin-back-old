import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

import {
  Grade,
  StayAtType,
  StayAtTypeValues,
  StayScheduleDayUnit,
  StayScheduleDayUnitValues,
} from "../../common/types";

export class StayScheduleDTO {
  @ApiProperty({ enum: StayScheduleDayUnitValues })
  @IsString()
  dayUnit: StayScheduleDayUnit;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    description:
      "yyyyMMDDThhmm for specific year, MMDDThhmm for every year or (weekday like mon, tue.. etc)",
  })
  @IsString()
  from: string;

  @ApiProperty({
    description:
      "yyyyMMDDThhmm for specific year, MMDDThhmm for every year or (weekday like mon, tue.. etc)",
  })
  @IsString()
  to: string;

  @ApiProperty()
  @IsArray()
  grade: Grade[];

  @ApiProperty({
    description:
      "yyyyMMDDThhmm for specific year, MMDDThhmm for every year or (weekday like mon, tue.. etc)",
  })
  @IsString()
  applyFrom: string;

  @ApiProperty({
    description:
      "yyyyMMDDThhmm for specific year, MMDDThhmm for every year or (weekday like mon, tue.. etc)",
  })
  @IsString()
  applyTo: string;

  @ApiProperty({ enum: StayAtTypeValues })
  @IsString()
  stayPos: StayAtType;

  @ApiProperty({
    description:
      "일정 우선순위. 높을수록 높아짐. 학생이 잔류 신청시 가장 우선순위가 높은 스케줄이 적용됨.",
  })
  @IsNumber()
  priority: number;

  @ApiProperty({ description: "잔류 좌석 프리셋" })
  @IsString()
  preset: string;
}

export class StayStatus {
  @ApiProperty()
  @IsString()
  _id: string;

  @ApiProperty({ description: "잔류 신청자 이름" })
  @IsString()
  uName: string;

  @ApiProperty({ description: "잔류 신청자 성별" })
  @IsString()
  uGender: string;

  @ApiProperty()
  @IsNumber()
  uGrade: number;

  @ApiProperty()
  @IsNumber()
  uClass: number;

  @ApiProperty({ description: "잔류위치" })
  @IsString()
  stayLocation: string;
}

export class OutGoingSelectDTO {
  @ApiProperty()
  @IsString()
  goingOutId: string;
}

export class TeacherStayApplyDTO {
  @ApiProperty()
  @IsString()
  userId: string;

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

export class TeacherStayCancelDTO {
  @ApiProperty()
  @IsString()
  userId: string;
}
