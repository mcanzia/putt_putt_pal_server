import { HoleDTO } from "./HoleDTO";
import { PlayerColorDTO } from "./PlayerColorDTO";
import { PlayerDTO } from "./PlayerDTO";

export class RoomDTO {

    id: string;
    roomCode: string;
    players?: Map<String, PlayerDTO>;
    holes: Map<String, HoleDTO>;
    allPlayersJoined: boolean;
    numberOfHoles: number;
    playerColors: Array<PlayerColorDTO>


    constructor(id : string, roomCode : string, players: Map<String, PlayerDTO>, holes : Map<String, HoleDTO>, allPlayersJoined : boolean, numberOfHoles: number, playerColors : Array<PlayerColorDTO>) {
        this.id = id;
        this.roomCode = roomCode;
        this.players = players;
        this.holes = holes;
        this.allPlayersJoined = allPlayersJoined;
        this.numberOfHoles = numberOfHoles;
        this.playerColors = playerColors;
    }

    static createBaseRoom() : RoomDTO {
        return new RoomDTO('', RoomDTO.createRandomRoomCode(), new Map(), new Map(), false, 0, PlayerColorDTO.createBaseColors());
    }

    static createRandomRoomCode() : string {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * letters.length);
            result += letters[randomIndex];
        }
        
        return result;
    }
    
    toObject?() {
        return {
            id: this.id,
            roomCode: this.roomCode,
            players: Object.fromEntries(this.players!),
            holes: Object.fromEntries(this.holes),
            allPlayersJoined: this.allPlayersJoined,
            numberOfHoles: this.numberOfHoles,
            playerColors: this.playerColors
        };
    }
}