import { Command } from '@colyseus/command';
import { iIAll, iIMap } from '../../utilities/IterableIteratorUtils';
import { GameRoom } from '../GameRoom';
import { Player } from '../schema/Player';

export class ReadyUpCommand extends Command<GameRoom, {sessionId: string}> {
	execute({sessionId}: {sessionId: string}): void {
		this.state.players.get(sessionId).ready = true;
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
	execute({player}: {player: Player}) {
		player.selectedAction.execute();
	}
}