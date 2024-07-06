import { Scenes } from 'telegraf';

export interface MySessionScene extends Scenes.SceneSessionData {
	myProp: string;
	city: string;
}
