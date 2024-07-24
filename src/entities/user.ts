import { Entity, Property } from "@mikro-orm/core";

import { BaseEntity } from "./base";

@Entity({ tableName: "users" })
export class User extends BaseEntity {
	@Property({
		type: "varchar",
		length: 4,
	})
	name: string;
}
