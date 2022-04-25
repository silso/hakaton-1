import { Room } from "colyseus.js"
import { GameRoomState } from "../schema/GameRoomState"

export default class Game {
	private room:Room<GameRoomState>

	constructor(room: Room<GameRoomState>){
		this.room = room
	}

	initialize(): void {
		console.log(`${this.room.sessionId} attempting to join ${this.room.name}`)
		document.title = `${this.room.sessionId}'s game`
		this.room.onStateChange((state) => {console.log('called onStateChange in game', state);});

		this.room.onMessage('join-succeeded', clientId => {
			console.log(`${clientId} successfully joined room!`)
		})
	}

	sendTestMessage(): void {
		console.log('beep boop sent test-message')
		this.room.send('test-message', {})
	}

	listenTest(): void {
		this.room.onStateChange((state) => {console.log('called onStateChange in game', state);});
	}
}