import type { Model } from "mongoose";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Login, type LoginDocument, User, UserDocument } from "../../schemas";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Login.name)
    private loginModel: Model<LoginDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}
}
