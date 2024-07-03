import { MyContext } from '../context/context.interface';
import { Markup, Scenes } from 'telegraf';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../../logger/logger.interface';
import { PrismaService } from '../../database/prisma.service.';
import { Pizza } from '@prisma/client';

export const SCENE_CATALOG = 'catalog';

@injectable()
export class SceneCatalog {
	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {}

	generateCatalogKeyboard = async () => {
		const pizza: Pizza[] = await this.prismaService.prisma.pizza.findMany();
		return Markup.keyboard(
			pizza.map((item) =>
				Markup.button.callback(`${item.pizza_name} - $${item.base_price}`, `item_${item.pizza_id}`),
			),
		);
	};

	get = () => {
		const catalogScene = new Scenes.BaseScene<MyContext>(SCENE_CATALOG);
		this.logger.info(`[SceneCatalog] Вошли в сцену ${SCENE_CATALOG}`);

		catalogScene.enter(async (ctx) => ctx.reply('Наш каталог:', await this.generateCatalogKeyboard()));

		return catalogScene;
	};
}
