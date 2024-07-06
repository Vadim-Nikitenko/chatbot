import { Scenes } from 'telegraf';
import { MySessionScene } from './session.scene.interface';

export interface MySession extends Scenes.SceneSession<MySessionScene> {
	city: string
}
