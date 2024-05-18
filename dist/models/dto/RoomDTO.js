"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomDTO = void 0;
const PlayerColorDTO_1 = require("./PlayerColorDTO");
class RoomDTO {
    id;
    roomCode;
    players;
    holes;
    allPlayersJoined;
    numberOfHoles;
    playerColors;
    constructor(id, roomCode, players, holes, allPlayersJoined, numberOfHoles, playerColors) {
        this.id = id;
        this.roomCode = roomCode;
        this.players = players;
        this.holes = holes;
        this.allPlayersJoined = allPlayersJoined;
        this.numberOfHoles = numberOfHoles;
        this.playerColors = playerColors;
    }
    static createBaseRoom() {
        return new RoomDTO('', RoomDTO.createRandomRoomCode(), new Map(), new Map(), false, 0, PlayerColorDTO_1.PlayerColorDTO.createBaseColors());
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
            id: this.id,
            roomCode: this.roomCode,
            players: Object.fromEntries(this.players),
            holes: Object.fromEntries(this.holes),
            allPlayersJoined: this.allPlayersJoined,
            numberOfHoles: this.numberOfHoles,
            playerColors: this.playerColors
        };
    }
}
exports.RoomDTO = RoomDTO;
