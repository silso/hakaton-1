import { Player } from './Player';
import { Movement } from './actions/index';
import { SwapTile } from './actions/index';
import { ActionId } from './actions/AbstractAction';
import { GameRoomState } from './GameRoomState';

export type Actions = Movement.Action | SwapTile.Action;
export type ActionData = Actions['payload'];
export type ActionInput = Movement.Input | SwapTile.Input;
export type ActionPayload = {actionId: ActionId, actionData: ActionInput}


export function isPayloadTypeValid<ActionType extends Actions>(action: ActionType, actionData: ActionData): actionData is ActionType['payload'] {
	if (action instanceof Movement.Action && actionData.hasOwnProperty('displacement')) {
		return true;
	}
	if (action instanceof SwapTile.Action && actionData.hasOwnProperty('color')) {
		return true;
	}
	return false;
}

type ActionConstructor = new (player: Player, state: GameRoomState) => Actions;
export const ACTIONS = new Map<string, ActionConstructor>([
	[ActionId.Movement, Movement.Action],
	[ActionId.SwapTile, SwapTile.Action],
]);
