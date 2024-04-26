"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomDTO = void 0;
class RoomDTO {
    id;
    roomCode;
    players;
    holes;
    allPlayersJoined;
    numberOfHoles;
    constructor(id, roomCode, players, holes, allPlayersJoined, numberOfHoles) {
        this.id = id;
        this.roomCode = roomCode;
        this.players = players;
        this.holes = holes;
        this.allPlayersJoined = allPlayersJoined;
        this.numberOfHoles = numberOfHoles;
    }
    toObject() {
        return {
            id: this.id,
            roomCode: this.roomCode,
            players: this.players.map(player => player.toObject ? player.toObject() : player),
            holes: this.holes.map(hole => hole.toObject ? hole.toObject() : hole),
            allPlayersJoined: this.allPlayersJoined,
            numberOfHoles: this.numberOfHoles
        };
    }
}
exports.RoomDTO = RoomDTO;
