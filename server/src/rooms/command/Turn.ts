import { Command } from '@colyseus/command';
import { iIAll, iIMap } from '../../utilities/IterableIteratorUtils';
import { GameRoom } from '../GameRoom';
import { ActionData, ACTIONS, ACTION_ID } from '../schema/Action';
import { Player } from '../schema/Player';

export class LockInCommand extends Command<GameRoom, {player: Player}> {
	execute(payload: this['payload']): Command {
		payload.player.ready = true;
		// this will queue up this command next, I think.
		return new CheckExecuteCommand();
	}
}

export class CheckExecuteCommand extends Command<GameRoom> {
	execute() {
		if (iIAll(this.state.players.values(), (player) => player.ready)) {
			return iIMap(this.state.players.values(), (player => new ExecuteTurnCommand().setPayload({player: player})));
		}
	}
}

export class ExecuteTurnCommand extends Command<GameRoom, {player: Player}> {
	execute(payload: this['payload']) {
		payload.player.selectedAction.execute();
	}
}

export class SelectActionCommand extends Command<GameRoom, {player: Player, actionId: string, actionData: ActionData}> {
	validate(payload: this['payload']): boolean {
		// this should fail the command if the actionId is not in the enum, I think.
		return payload.actionId in ACTION_ID;
	}

	execute(payload: this['payload']) {
		// get the constructor for the respective actionId
		const SelectedAction = ACTIONS.get(payload.actionId);
		// then instantiate it with the player and actionData
		payload.player.selectedAction = new SelectedAction(payload.player, payload.actionData);
	}
}