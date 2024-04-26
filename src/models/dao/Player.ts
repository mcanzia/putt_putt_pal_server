export class Player {

    name: string;
    playerNumber: number;

    constructor(name : string, playerNumber : number) {
        this.name = name;
        this.playerNumber = playerNumber;
    }

    toObject?() {
        return {
            name: this.name,
            playerNumber: this.playerNumber
        };
    }
}