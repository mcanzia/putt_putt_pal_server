import { PlayerDTO } from "./PlayerDTO";

export class LeaveRoomDetails {

    player: PlayerDTO;
    roomCode: string;

    constructor(player : PlayerDTO, roomCode : string) {
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