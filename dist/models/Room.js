"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
class Room {
    roomCode;
    players;
    holes;
    constructor(roomCode, players, holes) {
        this.roomCode = roomCode;
        this.players = players;
        this.holes = holes;
    }
    static createBaseRoom() {
        return new Room(Room.createRandomRoomCode(), [], []);
    }
    static createRandomRoomCode() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * letters.length);
            result += letters[randomIndex];
        }
        return result;
    }
    toObject() {
        return {
            roomCode: this.roomCode,
            players: this.players.map(player => player.toObject ? player.toObject() : player),
            holes: this.holes.map(hole => hole.toObject ? hole.toObject() : hole),
        };
    }
}
exports.Room = Room;
