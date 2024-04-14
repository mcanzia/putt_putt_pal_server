export class CreateRoomDetails {

    playerName: string;

    constructor(playerName : string) {
        this.playerName = playerName;
    }

    toObject?() {
        return {
            playerName: this.playerName,
        };
    }
}