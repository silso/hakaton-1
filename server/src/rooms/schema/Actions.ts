import { Player } from './Player';
import { ActionId } from './actions/AbstractAction';
import { GameRoomState } from './GameRoomState';
import { MovementAction, MovementInput } from './actions/Movement';
import { SwapTileAction, SwapTileInput } from './actions/SwapTile';

export type Actions = MovementAction | SwapTileAction;
export type ActionData = Actions['payload'];
export type ActionInput = MovementInput | SwapTileInput;
export type ActionPayload = {actionId: ActionId, actionData: ActionInput}


export function isPayloadTypeValid<ActionType extends Actions>(action: ActionType, actionData: ActionData): actionData is ActionType['payload'] {
	if (action instanceof MovementAction && actionData.hasOwnProperty('displacement')) {
		return true;
	}
	if (action instanceof SwapTileAction && actionData.hasOwnProperty('color')) {
		return true;
	}
	return false;
}

type ActionConstructor = new (player: Player, state: GameRoomState) => Actions;
export const ACTIONS = new Map<string, ActionConstructor>([
	[ActionId.Movement, MovementAction],
	[ActionId.SwapTile, SwapTileAction],
]);

export function initializeAction<ActionType extends Actions>(action: ActionType, actionData: ActionInput): void {
	if (action instanceof MovementAction && action.isInputValid(actionData)) {
		action.payload = action.inputToPayload(actionData);
	} else if (action instanceof SwapTileAction && SwapTile.isInputValid(actionData)) {
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