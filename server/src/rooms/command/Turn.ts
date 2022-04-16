import { Command } from '@colyseus/command';
import { GameRoom } from '../GameRoom';
import { ACTIONS, ActionInput } from '../schema/Action';
import { Movement } from '../schema/actions/index';
import { Player } from '../schema/Player';

export class ExecuteActionCommand extends Command<GameRoom, {player: Player, action: {actionId: string, actionData: ActionInput}}> {
	validate(payload: this['payload']): boolean {
		// this should fail the command if the actionId is not in the enum, I think.
		return true;//payload.action.actionId in ActionId;
	}

	execute({player, action: {actionId, actionData}}: this['payload']) {
		console.log('executing action on player', player.toJSON());
		// get the constructor for the respective actionId
		const SelectedAction = ACTIONS.get(actionId);
		// then instantiate it with the player and actionData
		const action = new SelectedAction(player);
		if (action instanceof Movement.Action && Movement.isInputValid(actionData)) {
			const newMovement = Movement.inputToPayload(actionData);
			action.payload = newMovement;
			console.log('movement to execute:', newMovement);
		// } else if (action instanceof SwapTileAction && isPayloadTypeValid(action, actionData)) {
		// 	actionData;
		} else {
			throw new Error(`Invalid action or action payload: ${actionId}, ${actionData}`);
		}
		action.execute();
		console.log('action successfully executed on player', player.toJSON());
	}
}