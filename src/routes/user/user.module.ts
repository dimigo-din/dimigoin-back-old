import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import {
  LaundryApply,
  LaundryApplySchema,
  Login,
  LoginSchema,
  MusicVote,
  MusicVoteSchema,
  User,
  UserSchema,
  UserStudent,
  UserStudentSchema,
} from "../../schemas";
import { Token, TokenSchema } from "../../schemas/token.schema";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Login.name, schema: LoginSchema },
      { name: Token.name, schema: TokenSchema },
      { name: User.name, schema: UserSchema },
      { name: UserStudent.name, schema: UserStudentSchema },
      { name: MusicVote.name, schema: MusicVoteSchema },
      { name: LaundryApply.name, schema: LaundryApplySchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
