import { Hole } from "./Hole";
import { Player } from "./Player";
import { PlayerColor } from "./PlayerColor";

export class Room {

    roomCode: string;
    players: Map<String, Player>;
    holes: Map<String, Hole>;
    allPlayersJoined: boolean;
    numberOfHoles: number;

    constructor(roomCode : string, players: Map<String, Player>, holes : Map<String, Hole>, allPlayersJoined: boolean, numberOfHoles: number) {
        this.roomCode = roomCode;
        this.players = players;
        this.holes = holes;
        this.allPlayersJoined = allPlayersJoined;
        this.numberOfHoles = numberOfHoles;
    }

    static createBaseRoom() : Room {
        return new Room(Room.createRandomRoomCode(), new Map(), new Map(), false, 0);
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
            roomCode: this.roomCode,
            players: Object.fromEntries(this.players),
            holes: Object.fromEntries(this.holes),
            allPlayersJoined: this.allPlayersJoined,
            numberOfHoles: this.numberOfHoles,
        };
    }
}