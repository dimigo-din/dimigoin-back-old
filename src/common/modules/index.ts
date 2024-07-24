export * from "./swagger.module";

import { DIMIConfigModule } from "./config.module";
import { DIMIMikroModule } from "./mikro.module";

export const DIMIEssentialModules = [DIMIConfigModule, DIMIMikroModule];
