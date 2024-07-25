export * from "./swagger.module";

import { DIMIConfigModule } from "./config.module";
import { DIMIDatabaseModule } from "./database.module";
import { DIMIJWTModule } from "./jwt.module";
import { DIMIScheduleModule } from "./schedule.module";

export const DIMIEssentialModules = [
	DIMIConfigModule,
	DIMIDatabaseModule,
	DIMIJWTModule,
	DIMIScheduleModule,
];
