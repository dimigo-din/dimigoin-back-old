import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { Gender, UserType } from "../../common/types";

export class CreatePasswordDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  gender: Gender;

  @ApiProperty()
  @IsString()
  type: UserType;

  @ApiProperty()
  @IsString()
  generation: number;
}
