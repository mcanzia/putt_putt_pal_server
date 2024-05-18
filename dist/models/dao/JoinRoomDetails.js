"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRoomDetails = void 0;
class JoinRoomDetails {
    playerName;
    roomCode;
    isHost;
    constructor(playerName, roomCode, isHost) {
        this.playerName = playerName;
        this.roomCode = roomCode;
        this.isHost = isHost;
    }
    toObject() {
        return {
            playerName: this.playerName,
            roomCode: this.roomCode,
            isHost: this.isHost,
        };
    }
}
exports.JoinRoomDetails = JoinRoomDetails;
