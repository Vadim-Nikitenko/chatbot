import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';

export const TOKEN = 'TOKEN';

@injectable()
export class ConfigService implements IConfigService {
	private readonly config: DotenvParseOutput;

	constructor(@inject(TYPES.LoggerService) private log: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.log.error(
				'[ConfigService] Не удалось прочитать файл .env или от отсутствует',
			);
		} else {
			this.log.info('[ConfigService] Конфигурация .env загружена');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
