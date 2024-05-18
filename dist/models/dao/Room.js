"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const PlayerColor_1 = require("./PlayerColor");
class Room {
    roomCode;
    players;
    holes;
    allPlayersJoined;
    numberOfHoles;
    playerColors;
    constructor(roomCode, players, holes, allPlayersJoined, numberOfHoles, playerColors) {
        this.roomCode = roomCode;
        this.players = players;
        this.holes = holes;
        this.allPlayersJoined = allPlayersJoined;
        this.numberOfHoles = numberOfHoles;
        this.playerColors = playerColors;
    }
    static createBaseRoom() {
        return new Room(Room.createRandomRoomCode(), new Map(), new Map(), false, 0, PlayerColor_1.PlayerColor.createBaseColors());
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
            playerColors: this.playerColors,
        };
    }
}
exports.Room = Room;
