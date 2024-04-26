export class PlayerDTO {

    id: string;
    name: string;
    playerNumber: number;

    constructor(id: string, name : string, playerNumber : number) {
        this.id = id;
        this.name = name;
        this.playerNumber = playerNumber;
    }

    toObject?() {
        return {
            id: this.id,
            name: this.name,
            playerNumber: this.playerNumber
        };
    }
}