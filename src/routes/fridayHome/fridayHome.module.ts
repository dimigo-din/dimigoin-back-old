import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { User, UserSchema } from "../../schemas";
import { FridayHome, FridayHomeSchema } from "../../schemas/fridayHome.schema";

import { FridayHomeController } from "./fridayHome.controller";
import { FridayHomeService } from "./fridayHome.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: FridayHome.name, schema: FridayHomeSchema },
    ]),
  ],
  controllers: [FridayHomeController],
  providers: [FridayHomeService],
})
export class FridayHomeModule {}
