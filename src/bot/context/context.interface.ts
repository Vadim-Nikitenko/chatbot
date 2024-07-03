import { Context, Scenes } from 'telegraf';
import { MySessionScene } from './session.scene.interface';
import { MySession } from './session.interface';
import {Address, User} from '@prisma/client';

export interface MyContext extends Context {
	city: string
	session: MySession;
	scene: Scenes.SceneContextScene<MyContext, MySessionScene>;
	wizard: Scenes.WizardContextWizard<MyContext>;
}
