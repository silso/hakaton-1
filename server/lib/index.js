"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const GameRoom_1 = require("./rooms/GameRoom");
const PORT = 2567;
const gameServer = new colyseus_1.Server();
gameServer.define('lobby', colyseus_1.LobbyRoom);
gameServer.define('game-room', GameRoom_1.GameRoom).enableRealtimeListing();
gameServer.listen(PORT);
