import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SelectDTO {
  @ApiProperty()
  @IsString()
  videoId: string;
}

export class DeleteDTO {
  @ApiProperty()
  @IsString()
  videoId: string;
}
