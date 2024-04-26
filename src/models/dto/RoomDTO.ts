import { HoleDTO } from "./HoleDTO";
import { PlayerDTO } from "./PlayerDTO";

export class RoomDTO {

    id: string;
    roomCode: string;
    players: Array<PlayerDTO>;
    holes: Array<HoleDTO>;
    allPlayersJoined: boolean;
    numberOfHoles: number;


    constructor(id : string, roomCode : string, players: Array<PlayerDTO>, holes : Array<HoleDTO>, allPlayersJoined : boolean, numberOfHoles: number) {
        this.id = id;
        this.roomCode = roomCode;
        this.players = players;
        this.holes = holes;
        this.allPlayersJoined = allPlayersJoined;
        this.numberOfHoles = numberOfHoles;
    }
    
    toObject?() {
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