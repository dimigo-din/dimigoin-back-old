import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { MongooseModuleAsyncOptions } from "@nestjs/mongoose";
import { MongooseModule } from "@nestjs/mongoose";

import { DIMIConfigModule } from "./config.module";

export const Mongooseoptions: MongooseModuleAsyncOptions = {
	imports: [DIMIConfigModule],
	inject: [ConfigService],
	useFactory: async (configService: ConfigService) => ({
		uri: configService.get<string>("MONGO_URI"),
		dbName: "dimigoin",

		connectionFactory: (connection) => {
			return connection;
		},
	}),
};

@Module({ imports: [MongooseModule.forRootAsync(Mongooseoptions)] })
export class DIMIDatabaseModule {}
