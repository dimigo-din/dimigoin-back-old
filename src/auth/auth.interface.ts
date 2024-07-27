import { Types } from "mongoose";

import { Gender, UserType } from "src/common/types";

export interface DIMIJwtPayload {
  _id: Types.ObjectId;
  id: string;
  name: string;
  gender: Gender;
  type: UserType;
  generation: number;
  iat: Date;
  exp: Date;
  refresh: boolean;
}

export interface DIMIRefreshPayload {
  _id: Types.ObjectId;
  refresh: boolean;
}
