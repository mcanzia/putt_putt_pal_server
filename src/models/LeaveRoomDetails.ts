import { Player } from "./Player";

export class LeaveRoomDetails {

    player: Player;
    roomCode: string;

    constructor(player : Player, roomCode : string) {
        this.player = player;
        this.roomCode = roomCode;
    }

    toObject?() {
        return {
            player: this.player.toObject ? this.player.toObject() : this.player,
            roomCode: this.roomCode
        };
    }
}