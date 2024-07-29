import type { Model } from "mongoose";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { v4 } from "uuid";

import { UserManageError } from "../../common/errors";
import {
  Login,
  type LoginDocument,
  User,
  UserDocument,
  UserStudent,
  UserStudentDocument,
} from "../../schemas";

import {
  CreateDimigoLoginDTO,
  CreatePasswordLoginDTO,
  CreateUserDTO,
  CreateUserStudentDTO,
} from "./userManage.dto";

@Injectable()
export class UserManageService {
  constructor(
    @InjectModel(Login.name)
    private loginModel: Model<LoginDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(UserStudent.name)
    private userStudentModel: Model<UserStudentDocument>,
  ) {}

  async getLogin(id) {
    try {
      const user = await this.userModel.findOne({ id: id });
      if (!user) throw new Error(UserManageError.UserNotFound);

      const login = await this.loginModel.find({ user: user._id });
      if (!login) throw new Error(UserManageError.LoginInfoUnavailable);

      const kinds = login.map((e) => e.type);
      return kinds;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async registerPasswordLogin(passwordDto: CreatePasswordLoginDTO) {
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

  async registerDimigoLogin(dimigoDTO: CreateDimigoLoginDTO) {
    try {
      const user = await this.userModel.findOne({ id: dimigoDTO.id });
      if (!user) throw new Error(UserManageError.UserNotFound);

      await new this.loginModel({
        type: "dimigo",
        value: dimigoDTO.sub,
        user: user._id,
      }).save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async registerUser(userDto: CreateUserDTO) {
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

  async registerUserStudent(userDto: CreateUserStudentDTO) {
    try {
      const user = await this.userModel.findById(userDto.user);
      if (!user) throw new Error(UserManageError.UserNotFound);

      await new this.userStudentModel({
        user: user._id,
        year: userDto.year,
        grade: userDto.grade,
        class: userDto.class,
        number: userDto.number,
      }).save();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
