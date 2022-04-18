import { Command } from '@colyseus/command';
import { GameRoom } from '../GameRoom';
import { ACTIONS, ActionInput } from '../schema/Actions';
import { Movement, SwapTile } from '../schema/actions/index';
import { Player } from '../schema/Player';
import { ActionId, AbstractAction } from '../schema/actions/AbstractAction';
import { GameRoomState } from '../schema/GameRoomState';
import { NextPhaseCommand } from './NextPhase';

export function createAction(player: Player, actionId: ActionId, state: GameRoomState): AbstractAction<unknown> {
	// get the constructor for the respective actionId
	const SelectedAction = ACTIONS.get(actionId);
	// then instantiate it with the player and game room state
	const action = new SelectedAction(player, state);
	return action;
}

export class ExecuteActionCommand extends Command<GameRoom, {action: AbstractAction<unknown>, actionData: ActionInput}> {
	execute({action, actionData}: this['payload']) {
		console.log('executing action on player', action.player.toJSON());
		if (action instanceof Movement.Action && Movement.isInputValid(actionData)) {
			const newMovement = Movement.inputToPayload(actionData);
			action.payload = newMovement;
		} else if (action instanceof SwapTile.Action && SwapTile.isInputValid(actionData)) {
			const newTile = SwapTile.inputToPayload(actionData);
			action.payload = newTile;
		} else {
			throw new Error(`Invalid action or action payload: ${action.id}, ${actionData}`);
		}
		console.log('action to execute:', action);
		action.execute();
		console.log('action successfully executed on player', action.player.toJSON());
		return new NextPhaseCommand();
	}
}