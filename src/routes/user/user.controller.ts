import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { UserManageService } from "../userManage/userManage.service";

@ApiTags("User")
@Controller("/user")
export class UserController {
  constructor(private readonly userManageService: UserManageService) {}
}
