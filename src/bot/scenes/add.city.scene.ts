import { MyContext } from '../context/context.interface';
import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../../logger/logger.interface';
import { PrismaService } from '../../database/prisma.service.';
import { SCENE_ADD_ADDRESS } from './add.address.scene';

const AVAILABLE_CITIES = ['Москва', 'Санкт-Петербург'];
export const SCENE_CITY = 'city';

@injectable()
export class SceneAddCity {
	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {}

	get() {
		const cityScene = new Scenes.BaseScene<MyContext>(SCENE_CITY);
		this.logger.info(`[SceneAddCity] Вошли в сцену ${SCENE_CITY}`);
		cityScene.enter((ctx) => ctx.reply('Введите город доставки'));

		cityScene.on(message('text'), (ctx) => {
			const city = ctx.message.text;
			if (AVAILABLE_CITIES.includes(city)) {
				ctx.session.city = city;
				ctx.scene.enter(SCENE_ADD_ADDRESS);
			} else {
				ctx.reply(
					`Извините, мы не осуществляем доставку в Ваш город. Выберите доступный город ${AVAILABLE_CITIES}`,
				);
			}
			this.logger.info(`[SceneAddCity] Вышли из сцены ${SCENE_CITY}`);
		});
		return cityScene;
	}
}
