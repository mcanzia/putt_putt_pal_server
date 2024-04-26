"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRoomDetails = void 0;
class JoinRoomDetails {
    playerName;
    roomCode;
    constructor(playerName, roomCode) {
        this.playerName = playerName;
        this.roomCode = roomCode;
    }
    toObject() {
        return {
            playerName: this.playerName,
            roomCode: this.roomCode
        };
    }
}
exports.JoinRoomDetails = JoinRoomDetails;
