import assert from 'assert';
import { ColyseusTestServer } from '@colyseus/testing';
import { GameRoomState } from '../src/rooms/schema/GameRoomState';
import { GameRoom } from '../src/rooms/GameRoom';
import { Server } from 'colyseus';

describe('testing your Colyseus app', () => {
	const server = new Server();
	server.define('game-room', GameRoom);
	let colyseus: ColyseusTestServer;

	before(async () => colyseus = new ColyseusTestServer(server));
	after(async () => colyseus.shutdown());

	beforeEach(async () => await colyseus.cleanup());

	it('connecting into a room', async () => {
		// `room` is the server-side Room instance reference.
		const room = await colyseus.createRoom<GameRoomState>('game-room', {});

		// `client1` is the client-side `Room` instance reference (same as JavaScript SDK)
		const client1 = await colyseus.connectTo(room);

		// make your assertions
		assert.strictEqual(client1.sessionId, room.clients[0].sessionId);

		// wait for state sync
		await room.waitForNextPatch();

		assert.deepStrictEqual({ mySynchronizedProperty: 'Hello world' }, client1.state.toJSON());
	});
});
