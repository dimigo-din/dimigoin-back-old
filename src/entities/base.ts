import { PrimaryKey } from "@mikro-orm/core";

export abstract class BaseEntity {
	@PrimaryKey({
		type: "uuid",
	})
	uuid: string;
}
