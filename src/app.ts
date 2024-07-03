import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';
import { PrismaService } from './database/prisma.service.';

@injectable()
export class App {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	public async init() {
		await this.prismaService.connect();
	}
}
