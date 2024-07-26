import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";

import { DIMIJWTModule } from "src/common/modules/jwt.module";
import { Token, TokenSchema } from "src/schemas/token.schema";

import {
  Login,
  LoginSchema,
  User,
  UserSchema,
  UserStudent,
  UserStudentSchema,
} from "src/schemas";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Login.name, schema: LoginSchema },
      { name: User.name, schema: UserSchema },
      { name: UserStudent.name, schema: UserStudentSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    DIMIJWTModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
