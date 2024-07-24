import type { MikroOrmModuleAsyncOptions } from "@mikro-orm/nestjs";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import importToArray from "import-to-array";

import * as entities from "src/entities";

import { DIMIConfigModule } from "./config.module";

const mikroOptions: MikroOrmModuleAsyncOptions = {
	imports: [DIMIConfigModule],
	inject: [ConfigService],
	useFactory: async (configService: ConfigService) => ({
		autoLoadEntities: true,
		entities: importToArray(entities),
		dbName: "dimigoin",
		driver: PostgreSqlDriver,
		host: configService.get<string>("DB_HOST"),
		port: configService.get<number>("DB_PORT"),
		user: configService.get<string>("DB_USER"),
		password: configService.get<string>("DB_PASS"),
	}),
};

@Module({
	imports: [MikroOrmModule.forRootAsync(mikroOptions)],
})
export class DIMIMikroModule {}
