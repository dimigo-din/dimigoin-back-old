import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TokensResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class PasswordLoginDto {
  @ApiProperty()
  @IsString()
  user: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class DimigoLoginDto {
  @ApiProperty()
  @IsString()
  token: string;
}

export class TokenRefreshDto {
  @ApiProperty()
  @IsString()
  token: string;
}
