export class JoinRoomDetails {

    playerName: string;
    roomCode: string;

    constructor(playerName : string, roomCode : string) {
        this.playerName = playerName;
        this.roomCode = roomCode;
    }

    toObject?() {
        return {
            playerName: this.playerName,
            roomCode: this.roomCode
        };
    }
}