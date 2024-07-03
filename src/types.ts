import {SceneAddCity} from "./bot/scenes/add.city.scene";
import {SceneAddAddress} from "./bot/scenes/add.address.scene";

export const TYPES = {
    Application: Symbol.for('Application'),
    PrismaService: Symbol.for('PrismaService'),
    LoggerService: Symbol.for('LoggerService'),
    BotService: Symbol.for('BotService'),
    SceneAddCity: Symbol.for('SceneAddCity'),
    ConfigService: Symbol.for('ConfigService'),
    SceneAddAddress: Symbol.for('SceneAddAddress'),
    SceneCatalog: Symbol.for('SceneCatalog'),
};
