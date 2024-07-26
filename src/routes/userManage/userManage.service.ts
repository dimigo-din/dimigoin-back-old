import type { Model } from "mongoose";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { v4 } from "uuid";

import { UserManageError } from "../../common/errors";
import { Login, type LoginDocument, User, UserDocument } from "../../schemas";

import { CreatePasswordDto, CreateUserDto } from "./userManage.dto";

@Injectable()
export class UserManageService {
  constructor(
    @InjectModel(Login.name)
    private loginModel: Model<LoginDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async registerPasswordLogin(passwordDto: CreatePasswordDto) {
    try {
      const user = await this.userModel.findOne({ id: passwordDto.id });
      if (!user) throw new Error(UserManageError.UserNotFound);

      await new this.loginModel({
        type: "password",
        value: bcrypt.hashSync(passwordDto.password, 5),
        user: user._id,
      }).save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async registerUser(userDto: CreateUserDto) {
    try {
      await new this.userModel({
        id: v4().split("-").join(""),
        ...userDto,
      }).save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
