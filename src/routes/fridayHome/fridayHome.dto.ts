import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class FridayHomeApplyDTO {
  @ApiProperty()
  @IsNumber()
  month: number;

  @ApiProperty()
  @IsNumber()
  week: number;

  @ApiProperty()
  @IsString()
  reason: string;
}

export class FridayHomeListDTO extends FridayHomeApplyDTO {
  @ApiProperty()
  @IsString()
  user: string;

  @ApiProperty()
  @IsBoolean()
  allowed: boolean | null;

  @ApiProperty()
  @IsString()
  teacherReason: string | null;
}

export class FridayHomeCancelDTO {
  @ApiProperty()
  @IsString()
  target: string;
}
