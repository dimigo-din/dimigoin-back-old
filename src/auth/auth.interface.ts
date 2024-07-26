import { Types } from "mongoose";

import { Gender, UserType } from "src/common/types";

export interface DIMIJwtPayload {
  _id: Types.ObjectId;
  name: string;
  gender: Gender;
  type: UserType;
  generation: number;
  created_at: Date;
  updated_at: Date;
  refresh: boolean;
}

export interface DIMIRefreshPayload {
  _id: Types.ObjectId;
  refresh: boolean;
}
