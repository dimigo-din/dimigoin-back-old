import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TokensResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class LoginDto {
  @ApiProperty()
  @IsString()
  token: string;
}