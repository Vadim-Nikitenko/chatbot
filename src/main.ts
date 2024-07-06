import 'dotenv/config';
import { App } from './app';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { PrismaService } from './database/prisma.service.';
import { LoggerService } from './logger/logger.service';
import { ILogger } from './logger/logger.interface';
import { IDbService } from './database/db.service.interface';
import { IBotService } from './bot/bot.service.interface';
import { BotService } from './bot/bot.service';
import { SceneAddCity } from './bot/scenes/add.city.scene';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { SceneAddAddress } from './bot/scenes/add.address.scene';
import {SceneCatalog} from "./bot/scenes/catalog.scene";

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
	bind<IBotService>(TYPES.BotService).to(BotService).inSingletonScope();
	bind<IDbService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<SceneAddCity>(TYPES.SceneAddCity).to(SceneAddCity).inSingletonScope();
	bind<SceneAddAddress>(TYPES.SceneAddAddress).to(SceneAddAddress).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<SceneCatalog>(TYPES.SceneCatalog).to(SceneCatalog).inSingletonScope();
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

const bootstrap = async (): Promise<IBootstrapReturn> => {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	const bot = appContainer.get<IBotService>(TYPES.BotService);
	await app.init();
	await bot.launch();
	return { appContainer, app };
};

export const boot = bootstrap();
