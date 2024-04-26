"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRoomDetails = void 0;
class LeaveRoomDetails {
    player;
    roomCode;
    constructor(player, roomCode) {
        this.player = player;
        this.roomCode = roomCode;
    }
    toObject() {
        return {
            player: this.player.toObject ? this.player.toObject() : this.player,
            roomCode: this.roomCode
        };
    }
}
exports.LeaveRoomDetails = LeaveRoomDetails;
