import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import {
  Login,
  LoginSchema,
  User,
  UserSchema,
  UserStudent,
  UserStudentSchema,
} from "../../schemas";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Login.name, schema: LoginSchema },
      { name: User.name, schema: UserSchema },
      { name: UserStudent.name, schema: UserStudentSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
