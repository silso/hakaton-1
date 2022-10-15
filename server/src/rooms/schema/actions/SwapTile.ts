import { AbstractAction } from './AbstractAction';
import { Tile } from '../Tile';

// actual actions
export class SwapTileAction extends AbstractAction<Tile> {
	doIsValid = () => {
		// yeah nothing to check for
		return true;
	};

	doExecute = () => {
		const board = this.state.board;
		const position = this.player.position;
		let playerTile = this.player.ownedTile;
		let boardTile = board.tiles.at(position.toNumber(board));
		[playerTile, boardTile] = [boardTile, playerTile];
	};

	isInputValid = (input: Record<string, unknown>): input is SwapTileInput => {
		return input.hasOwnProperty('color');
	};

	inputToPayload = (input: SwapTileInput) => new Tile(input);
}

export type SwapTileInput = ConstructorParameters<typeof Tile>[0];