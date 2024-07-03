import { MyContext } from '../context/context.interface';
import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../../logger/logger.interface';
import { PrismaService } from '../../database/prisma.service.';
import { User } from '@prisma/client';
import {SCENE_CATALOG} from "./catalog.scene";

export const SCENE_ADD_ADDRESS = 'add_address';

@injectable()
export class SceneAddAddress {
	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {}

	get() {
		const addAddressScene = new Scenes.BaseScene<MyContext>(SCENE_ADD_ADDRESS);
		this.logger.info(`[SceneAddAddress] Вошли в сцену ${SCENE_ADD_ADDRESS}`);
		addAddressScene.enter((ctx) => ctx.reply('Введите адрес'));

		addAddressScene.on(message('text'), async (ctx) => {
			const address = ctx.message.text;
			const user: User = await this.prismaService.find(ctx.message.from.username!);

			await this.prismaService.addAddress({user_id: user.id, address: address, city: ctx.session.city });

			ctx.scene.enter(SCENE_CATALOG);
			this.logger.info(`[SceneAddAddress] Вышли из сцены ${SCENE_ADD_ADDRESS}`);
		});
		return addAddressScene;
	}
}
