import { AbstractAction, ActionId } from './AbstractAction';
import { Tile } from '../Tile';

// actual actions
export class Action extends AbstractAction<Tile> {
	id = ActionId.SwapTile;

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
}

export type Input = ConstructorParameters<typeof Tile>[0];

export function isInputValid(input: Record<string, unknown>): input is Input {
	if (input.hasOwnProperty('color')) {
		return true;
	}
	return false;
}

export function inputToPayload(input: Input): Tile {
	return new Tile(input);
}