import { NestFactory } from "@nestjs/core";
import helmet from "helmet";

import { AppModule } from "src/app";
import { DIMINotFoundFilter } from "src/common/filters";
import { DIMISwaggerSetup } from "src/common/modules";
import { DIMIValidationPipe } from "src/common/pipes";

const bootstrap = async () => {
	const app = await NestFactory.create(AppModule);

	app.enableCors();
	app.use(helmet({ contentSecurityPolicy: false }));

	app.useGlobalPipes(DIMIValidationPipe());
	app.useGlobalFilters(new DIMINotFoundFilter());

	await DIMISwaggerSetup(app);

	await app.listen(3000);
};

bootstrap();
