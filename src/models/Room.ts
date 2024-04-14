import { Hole } from "./Hole";
import { Player } from "./Player";

export class Room {

    id: string;
    roomCode: string;
    players: Array<Player>;
    holes: Array<Hole>;


    constructor(id: string, roomCode : string, players: Array<Player>, holes : Array<Hole>) {
        this.id = id;
        this.roomCode = roomCode;
        this.players = players;
        this.holes = holes;
    }

    static createBaseRoom(playerName : string) : Room {
        const hostPlayer = new Player('', playerName, 1);
        return new Room('', Room.createRandomRoomCode(), [hostPlayer], []);
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
            players: this.players.map(player => player.toObject ? player.toObject() : player),
            holes: this.holes.map(hole => hole.toObject ? hole.toObject() : hole),
        };
    }
}