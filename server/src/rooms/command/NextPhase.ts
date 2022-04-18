import { GameRoom } from '../GameRoom';
import { Command } from '@colyseus/command';
import { iIMap } from '../../utilities/IterableIteratorUtils';
import { PhaseType } from '../schema/Phase';

export class NextPhaseCommand extends Command<GameRoom> {
	validate(): boolean {
		return this.state.phase !== undefined || this.state.phase !== null;
	}

	execute() {
		const players = iIMap(this.state.players.values(), (player) => player);
		if (this.state.phase.type === PhaseType.Movement) {
			this.state.phase.type = PhaseType.SwapTile;
		} else if (this.state.phase.type === PhaseType.SwapTile) {
			this.state.phase.type = PhaseType.Movement;
			const nextPlayer = players[players.indexOf(this.state.phase.player) + 1 % players.length];
			this.state.phase.player = nextPlayer;
		} else {
			throw new Error('Phase type not supported');
		}
	}
}