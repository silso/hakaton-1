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

export function initializeAction<ActionType extends Actions>(action: ActionType, actionData: ActionInput): void {
	if (action instanceof Movement.Action && Movement.isInputValid(actionData)) {
		const newMovement = Movement.inputToPayload(actionData);
		action.payload = newMovement;
	} else if (action instanceof SwapTile.Action && SwapTile.isInputValid(actionData)) {
		const newTile = SwapTile.inputToPayload(actionData);
		action.payload = newTile;
	} else {
		throw new Error(`Invalid action or action payload: ${action.id}, ${actionData}`);
	}
}

export function createAction(player: Player, state: GameRoomState, {actionId, actionData}: ActionPayload): Actions {
	// get the constructor for the respective actionId
	const SelectedAction = ACTIONS.get(actionId);
	// then instantiate it with the player and game room state
	const action = new SelectedAction(player, state);
	initializeAction(action, actionData);
	return action;
}