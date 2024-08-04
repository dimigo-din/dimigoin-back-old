import { Module } from "@nestjs/common";
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
  Password,
  PasswordSchema,
} from "src/schemas";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { DIMIJwtStrategy } from "./auth.strategy";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Login.name, schema: LoginSchema },
      { name: User.name, schema: UserSchema },
      { name: UserStudent.name, schema: UserStudentSchema },
      { name: Token.name, schema: TokenSchema },
      { name: Password.name, schema: PasswordSchema },
    ]),
    DIMIJWTModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, DIMIJwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
