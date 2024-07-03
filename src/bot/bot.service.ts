import 'dotenv/config';
import { Scenes, Telegraf } from 'telegraf';
import { MyContext } from './context/context.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IBotService } from './bot.service.interface';
import { Stage } from 'telegraf/scenes';
import LocalSession from 'telegraf-session-local';
import { SceneAddCity, SCENE_CITY } from './scenes/add.city.scene';
import { PrismaService } from '../database/prisma.service.';
import { SCENE_ADD_ADDRESS, SceneAddAddress } from './scenes/add.address.scene';
import { ConfigService, TOKEN } from '../config/config.service';
import { Address, User } from '@prisma/client';
import {SCENE_CATALOG, SceneCatalog} from "./scenes/catalog.scene";

@injectable()
export class BotService implements IBotService {
	bot: Telegraf<MyContext>;
	stage: Stage<MyContext>;

	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.SceneAddCity) private sceneAddCity: SceneAddCity,
		@inject(TYPES.SceneAddAddress) private sceneAddAddress: SceneAddAddress,
		@inject(TYPES.SceneCatalog) private sceneCatalog: SceneCatalog,
		@inject(TYPES.ConfigService) private configService: ConfigService,
	) {
		if (!configService.get(TOKEN)) {
			throw new Error('Не задан token');
		}
		this.bot = new Telegraf<MyContext>(configService.get(TOKEN));
		this.stage = new Scenes.Stage<MyContext>([sceneAddCity.get(), sceneAddAddress.get(), sceneCatalog.get()]);
		this.bot.use(new LocalSession({database: 'session.json'}).middleware());
		this.bot.use(this.stage.middleware());
		this.logger.info('[BotService] Bot успешно запущен');
	}

	async launch(): Promise<void> {
		this.bot.command('start', async (ctx) => {
			const username = ctx.message.from.username;
			ctx.reply(`Привет, @${username}!`);

			const user: User = await this.prismaService.processUser({
				name: `${ctx.message.from.first_name} ${ctx.message.from.last_name}`,
				tgUsername: username!,
			});
			const address: Address | null = await this.prismaService.getUserAddress(user);

			if (!address) {
				ctx.scene.enter(SCENE_CITY);
			}

			ctx.scene.enter(SCENE_CATALOG);

		});
		await this.bot.launch();
	}
}
