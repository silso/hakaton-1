import { Schema, MapSchema, type } from '@colyseus/schema';
import { iIAll, iIMap } from '../../utilities/IterableIteratorUtils';
import { Validatable } from '../core/Validatable';
import { Board } from './Board';
import { Player } from './Player';
import { PlayerPhase } from './Phase';

export class GameRoomState extends Schema implements Validatable {
	@type(Board) board = new Board(4, 4);
	@type({map: Player}) players = new MapSchema<Player>();
	@type(PlayerPhase) phase: PlayerPhase;
	@type('number') testNumber = 0;

	isValid(): boolean {
		console.log('checking validity');
		const playerPositions = iIMap(this.players.values(), ({position}) => position.toNumber(this.board));
		return (
			this.board.isValid() &&
			iIAll(this.players.values(), ({position: {x, y}}) => 
				x >= 0 &&
				x < this.board.width &&
				y >= 0 &&
				y < this.board.height
			) &&
			playerPositions.length === [...new Set(playerPositions)].length
		);
	}
}
