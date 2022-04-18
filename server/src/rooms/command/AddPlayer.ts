import { Command } from '@colyseus/command';
import { GameRoom } from '../GameRoom';
import { Validatable } from '../core/Validatable';
import { Player } from '../schema/Player';
import { Tile, TileColor } from '../schema/Tile';
import { Position } from '../schema/Position';
import { PlayerPhase, PhaseType } from '../schema/Phase';

export const MAX_PLAYERS = 2;

export class AddPlayerCommand extends Command<GameRoom, {sessionId: string}> implements Validatable {
	isValid(): boolean {
		if (this.state.players.size === MAX_PLAYERS) {
			return false;
		}
		return true;
	}

	execute(payload: this['payload']): void {
		let player;
		if (this.state.players.size === 0) {
			player = new Player(new Tile({color: TileColor.Red}));
			player.position = new Position(0, 0);
			this.state.phase = new PlayerPhase(player, PhaseType.Movement);
		} else {
			player = new Player(new Tile({color: TileColor.Red}));
			player.position = new Position(3, 3);
		}
		this.state.players.set(payload.sessionId, player);
	}
}