import { Room } from "colyseus.js"
import { GameRoomState } from "../schema/GameRoomState"

export default class Game {
	private room:Room<GameRoomState>

	constructor(room: Room<GameRoomState>){
		this.room = room
	}

	sendTestMessage(): void {
		console.log(this.room.sessionId, 'joined', this.room.name)
		this.room.send('test-message', {})
	}

	listenTest(): void {
		this.room.onStateChange((state) => {console.log('called onStateChange in game', state);});
	}
}