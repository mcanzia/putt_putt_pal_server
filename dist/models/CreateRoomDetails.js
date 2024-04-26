"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomDetails = void 0;
class CreateRoomDetails {
    playerName;
    constructor(playerName) {
        this.playerName = playerName;
    }
    toObject() {
        return {
            playerName: this.playerName,
        };
    }
}
exports.CreateRoomDetails = CreateRoomDetails;
