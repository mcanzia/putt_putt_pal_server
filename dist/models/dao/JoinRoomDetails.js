"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRoomDetails = void 0;
class JoinRoomDetails {
    playerName;
    roomCode;
    isHost;
    color;
    constructor(playerName, roomCode, isHost, color) {
        this.playerName = playerName;
        this.roomCode = roomCode;
        this.isHost = isHost;
        this.color = color;
    }
    toObject() {
        return {
            playerName: this.playerName,
            roomCode: this.roomCode,
            isHost: this.isHost,
            color: this.color.toObject ? this.color.toObject() : this.color,
        };
    }
}
exports.JoinRoomDetails = JoinRoomDetails;
