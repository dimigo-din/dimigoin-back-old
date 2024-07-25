import { Module } from "@nestjs/common";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Login, LoginSchema, User, UserSchema, UserStudent, UserStudentSchema } from "src/schemas";

@Module({
	imports: [MongooseModule.forFeature([
		{ name: Login.name, schema: LoginSchema },
		{ name: User.name, schema: UserSchema },
		{ name: UserStudent.name, schema: UserStudentSchema },
	])],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
