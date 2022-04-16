import { Schema, type } from '@colyseus/schema';
import { Player } from './Player';
import { Tile } from './Tile';
import { Movement } from './actions/index';
import { ActionId } from './actions/BaseAction';

// export class SwapTileAction extends BaseAction<Tile> {
// 	id = ActionId.Test;

// 	doExecute = () => {
// 		console.log('test');
// 	};
// }

export type Actions = Movement.Action;// | SwapTileAction;
export type ActionData = Actions['payload'];
export type ActionInput = Movement.Input;

export function isPayloadTypeValid<ActionType extends Actions>(action: ActionType, actionData: ActionData): actionData is ActionType['payload'] {
	if (action instanceof Movement.Action && actionData.hasOwnProperty('displacement')) {
		return true;
	}
	// if (action instanceof SwapTileAction && actionData.hasOwnProperty('color')) {
	// 	return true;
	// }
}

type ActionConstructor = new (player: Player) => Actions;
export const ACTIONS = new Map<string, ActionConstructor>([
	[ActionId.Movement, Movement.Action],
]);
