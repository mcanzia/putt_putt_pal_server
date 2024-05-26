import { PlayerColorDTO } from "../dto/PlayerColorDTO";

export class JoinRoomDetails {

    playerName: string;
    roomCode: string;
    isHost: boolean;
    color: PlayerColorDTO;

    constructor(playerName : string, roomCode : string, isHost : boolean, color: PlayerColorDTO) {
        this.playerName = playerName;
        this.roomCode = roomCode;
        this.isHost = isHost;
        this.color = color;
    }

    toObject?() {
        return {
            playerName: this.playerName,
            roomCode: this.roomCode,
            isHost: this.isHost,
            color: this.color.toObject ? this.color.toObject() : this.color,
        };
    }
}