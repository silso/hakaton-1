import { GameRoom } from '../GameRoom';
import { Command } from '@colyseus/command';
import { iIMap } from '../../utilities/IterableIteratorUtils';
import { ActionId } from '../schema/actions/AbstractAction';
import { PlayerPhase, GameOverPhase } from '../schema/Phase';
import { TileColor } from '../schema/Tile';
import { Position } from '../schema/Position';

export class NextPhaseCommand extends Command<GameRoom> {
	validate(): boolean {
		return this.state.phase !== undefined || this.state.phase !== null;
	}

	isGameOver() {
		// 4 in a row or col
		const tiles: TileColor[][] = [];
		let pos;
		iIMap(this.state.board.tiles.entries(), ([index, tile]) => {
			pos = Position.fromNumber(index, this.state.board);
			tiles[pos.y][pos.x] = tile.color;
		});

		const tilesTransposed = tiles[0].map((_, colIndex) => tiles.map(row => row[colIndex]));
		
		return (
			tiles.some(row => row.every(tile => row[0] === tile))
			|| tilesTransposed.some(row => row.every(tile => row[0] === tile))
		);
	}

	execute() {
		const players = iIMap(this.state.players.values(), (player) => player);
		let handled = false;

		if (this.state.phase instanceof GameOverPhase) {
			console.log('game over, no phase change');
			handled = true;
		}

		if (this.state.phase instanceof PlayerPhase) {
			if (this.isGameOver()) {
				this.state.phase = new GameOverPhase(this.state.phase.player);
				handled = true;
			} else if (this.state.phase.type === ActionId.Movement) {
				this.state.phase.type = ActionId.SwapTile;
				handled = true;
			} else if (this.state.phase.type === ActionId.SwapTile) {
				this.state.phase.type = ActionId.Movement;
				const nextPlayer = players[(players.indexOf(this.state.phase.player) + 1) % players.length];
				this.state.phase.player = nextPlayer;
				handled = true;
			}
		}
		
		if (!handled) {
			throw new Error('Phase type not supported');
		}
	}
}