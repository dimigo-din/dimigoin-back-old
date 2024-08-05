import type { Model } from "mongoose";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";

import { UserManageError } from "../../common/errors";
import {
  Login,
  type LoginDocument,
  User,
  UserDocument,
  UserStudent,
  UserStudentDocument,
  Password,
  PasswordDocument,
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
    @InjectModel(Password.name)
    private passwordModel: Model<PasswordDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(UserStudent.name)
    private userStudentModel: Model<UserStudentDocument>,
  ) {}

  async getLogin(id) {
    try {
      const login = await this.loginModel.find({ user: id });
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
      const password = await new this.passwordModel({
        id: passwordDto.id,
        password: bcrypt.hashSync(passwordDto.password, 5),
        user: passwordDto.user,
      }).save();

      await new this.loginModel({
        type: "password",
        value: password._id,
        user: passwordDto.user,
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
      // TODO: check is ok when use await new this.userModel(userDto).save()
      await new this.userModel({
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
      const user = await this.userModel.findById(userDto.id);
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
