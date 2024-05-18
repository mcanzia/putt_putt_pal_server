export class JoinRoomDetails {

    playerName: string;
    roomCode: string;
    isHost: boolean;

    constructor(playerName : string, roomCode : string, isHost : boolean) {
        this.playerName = playerName;
        this.roomCode = roomCode;
        this.isHost = isHost;
    }

    toObject?() {
        return {
            playerName: this.playerName,
            roomCode: this.roomCode,
            isHost: this.isHost,
        };
    }
}