"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
class Room {
    roomCode;
    players;
    holes;
    allPlayersJoined;
    numberOfHoles;
    constructor(roomCode, players, holes, allPlayersJoined, numberOfHoles) {
        this.roomCode = roomCode;
        this.players = players;
        this.holes = holes;
        this.allPlayersJoined = allPlayersJoined;
        this.numberOfHoles = numberOfHoles;
    }
    static createBaseRoom() {
        return new Room(Room.createRandomRoomCode(), new Map(), new Map(), false, 0);
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
            players: Object.fromEntries(this.players),
            holes: Object.fromEntries(this.holes),
            allPlayersJoined: this.allPlayersJoined,
            numberOfHoles: this.numberOfHoles,
        };
    }
}
exports.Room = Room;
