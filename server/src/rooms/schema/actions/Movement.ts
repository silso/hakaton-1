import { iIAll } from '../../../utilities/IterableIteratorUtils';
import { Movement } from '../Movesets';
import { AbstractAction } from './AbstractAction';

// actual actions
export class MovementAction extends AbstractAction<Movement> {
	doIsValid = () => {
		const playerMoveset = this.state.board.tileMovesets.get(this.player.ownedTile.color);
		const actionMovement = this.payload.toNumber(this.state.board);
		if (!playerMoveset.movements.has(actionMovement)) {
			console.log('invalid movement for player\'s moveset');
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
			console.log('movement out of bounds');
			return false;
		}

		
		if (iIAll(this.state.players.values(), player => (player === this.player) && player.position.x !== this.player.position.x && player.position.y !== this.player.position.y)) {
			console.log('player positions would be on top of each other');
			return false;
		}
		return true;
	};

	doExecute = () => {
		this.player.move(this.payload);
	};

	isInputValid = (input: Record<string, unknown>): input is MovementInput => {
		return input.hasOwnProperty('x') && input.hasOwnProperty('y');
	};

	inputToPayload = (input: MovementInput) => new Movement(input);
}

export type MovementInput = ConstructorParameters<typeof Movement>[0];