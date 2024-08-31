export class PlayerRoom {
    roomId : string;
    playerId : string;

    constructor(roomId : string, playerId : string) {
        this.roomId = roomId;
        this.playerId = playerId;
    }

    toObject?() {
        return {
            roomId: this.roomId,
            playerId: this.playerId
        };
    }

}