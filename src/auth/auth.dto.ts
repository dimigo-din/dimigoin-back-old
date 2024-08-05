import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TokensResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class PasswordLoginDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class DimigoLoginDTO {
  @ApiProperty()
  @IsString()
  token: string;
}

export class TokenRefreshDTO {
  @ApiProperty()
  @IsString()
  token: string;
}
