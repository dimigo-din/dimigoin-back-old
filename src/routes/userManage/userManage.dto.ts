import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

import { Gender, UserType } from "../../common/types";

export class CreatePasswordLoginDTO {
  @ApiProperty()
  @IsString()
  user: string;

  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class CreateDimigoLoginDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  email: string;
}

export class CreateUserDTO {
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
  @IsNumber()
  generation: number;
}

export class CreateUserStudentDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  year: number;

  @ApiProperty()
  @IsString()
  grade: number;

  @ApiProperty()
  @IsString()
  class: number;

  @ApiProperty()
  @IsString()
  number: number;
}
