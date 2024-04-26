import { Hole } from "./Hole";
import { Player } from "./Player";

export class Room {

    roomCode: string;
    players: Array<Player>;
    holes: Array<Hole>;
    allPlayersJoined: boolean;
    numberOfHoles: number;


    constructor(roomCode : string, players: Array<Player>, holes : Array<Hole>, allPlayersJoined: boolean, numberOfHoles: number) {
        this.roomCode = roomCode;
        this.players = players;
        this.holes = holes;
        this.allPlayersJoined = allPlayersJoined;
        this.numberOfHoles = numberOfHoles;
    }

    static createBaseRoom() : Room {
        return new Room(Room.createRandomRoomCode(), [], [], false, 0);
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
            players: this.players.map(player => player.toObject ? player.toObject() : player),
            holes: this.holes.map(hole => hole.toObject ? hole.toObject() : hole),
            allPlayersJoined: this.allPlayersJoined,
            numberOfHoles: this.numberOfHoles
        };
    }
}