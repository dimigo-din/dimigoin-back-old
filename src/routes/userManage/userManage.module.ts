import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import {
  Login,
  LoginSchema,
  User,
  UserSchema,
  UserStudent,
  UserStudentSchema,
} from "src/schemas";

import { UserManageController } from "./userManage.controller";
import { UserManageService } from "./userManage.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Login.name, schema: LoginSchema },
      { name: User.name, schema: UserSchema },
      { name: UserStudent.name, schema: UserStudentSchema },
    ]),
  ],
  controllers: [UserManageController],
  providers: [UserManageService],
})
export class UserManageModule {}
