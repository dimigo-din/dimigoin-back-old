import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

import { AuthError } from "../../common/errors";

@Injectable()
export class DIMISelfGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      if (request.user.id !== request.body.id)
        throw new Error(AuthError.PermissionDenied);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        "인증에 실패하였습니다.",
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }
}
