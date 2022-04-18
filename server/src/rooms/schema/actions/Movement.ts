import { AbstractAction, ActionId } from './AbstractAction';
import { Movement } from '../Movesets';
import { iIAll } from '../../../utilities/IterableIteratorUtils';

// actual actions
export class Action extends AbstractAction<Movement> {
	id = ActionId.Movement;

	doIsValid = () => {
		const playerMoveset = this.state.board.tileMovesets.get(this.player.ownedTile.color);
		const actionMovement = this.payload.toNumber(this.state.board);
		if (!playerMoveset.movements.has(actionMovement)) {
			// invalid movement for player's moveset
			return false;
		}
		// new position
		const {x: newX, y: newY} = this.player.position.add(this.payload.displacement);
		if (
			newX < 0 &&
			newX >= this.state.board.width &&
			newY < 0 &&
			newY >= this.state.board.height
		) {
			// movement out of bounds
			return false;
		}

		
		if (iIAll(this.state.players.values(), player => (player === this.player) && player.position.x !== this.player.position.x && player.position.y !== this.player.position.y)) {
			// player positions would be on top of each other
			return false;
		}
		return true;
	};
	doExecute = () => {
		this.player.move(this.payload);
	};
}

export type Input = ConstructorParameters<typeof Movement>[0];

export function isInputValid(input: Record<string, unknown>): input is Input {
	if (input.hasOwnProperty('x') && input.hasOwnProperty('y')) {
		return true;
	}
	return false;
}

export function inputToPayload(input: Input): Movement {
	return new Movement(input);
}