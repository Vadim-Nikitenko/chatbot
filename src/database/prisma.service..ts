import { Address, PrismaClient, User } from '@prisma/client';
import { IDbService } from './db.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService implements IDbService {
	prisma: PrismaClient;

	constructor(@inject(TYPES.LoggerService) private logger: ILogger) {
		this.prisma = new PrismaClient();
	}

	hasUser = async (tgUsername: string): Promise<boolean> => {
		return !!(await this.prisma.user.findFirst({
			where: { tgUsername: tgUsername },
		}));
	};

	processUser = async (user: { name: string; tgUsername: string }): Promise<User> => {
		if (!(await this.hasUser(user.tgUsername))) {
			return this.prisma.user.create({
				data: user,
			});
		}
		return this.find(user.tgUsername);
	};

	find = async (tgUsername: string): Promise<User> => {
		return this.prisma.user.findFirstOrThrow({
			where: { tgUsername: tgUsername },
		});
	};

	connect = async () => {
		try {
			await this.prisma.$connect();
			this.logger.info('[PrismaService] Успешно подключились к базе данных');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error('[PrismaService] Ошибка подключения к базе данных: ' + e.message);
			}
		}
	};

	disconnect = async () => {
		await this.prisma.$disconnect();
	};

	getUserAddress = async (user: User | null): Promise<Address | null> => {
		if (user) {
			return this.prisma.address.findFirst({
				where: { user: { id: user.id } },
			});
		}
		return null;
	};

	addAddress = async (data: {
		address: string;
		user_id: number;
		city: string;
	}): Promise<Address> => {
		return this.prisma.address.create({
			data: {
				user_id: data.user_id,
				address: data.address,
				city: data.city,
			},
		});
	};
}
