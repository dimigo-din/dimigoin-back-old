import { Module } from "@nestjs/common";
import type { MiddlewareConsumer, NestModule } from "@nestjs/common";
import * as moment from "moment-timezone";

import { DIMILoggerMiddleware } from "src/common/middlewares";
import { DIMIEssentialModules } from "src/common/modules";

import { AppService } from "./app.service";

@Module({
	imports: [...DIMIEssentialModules],
	providers: [AppService],
})
export class AppModule implements NestModule {
	constructor() {
		moment.tz.setDefault("Asia/Seoul");
	}

	configure(consumer: MiddlewareConsumer) {
		consumer.apply(DIMILoggerMiddleware).forRoutes("*");
	}
}
