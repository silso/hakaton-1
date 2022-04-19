import { Command } from '@colyseus/command';
import { GameRoom } from '../GameRoom';
import { NextPhaseCommand } from './NextPhase';
import { AbstractAction } from '../schema/actions/AbstractAction';

export class ExecuteActionCommand extends Command<GameRoom, {action: AbstractAction<unknown>}> {
	execute({action}: this['payload']) {
		console.log('executing action on player', action.toJSON(), action.player.toJSON());
		action.execute();
		console.log('action successfully executed on player', action.player.toJSON());
		return new NextPhaseCommand();
	}
}