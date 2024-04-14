import { PlayerScore } from "./PlayerScore";

export class Hole {

    holeNumber: number;
    playerScores: Array<PlayerScore>;

    constructor(number : number, playerScores : Array<PlayerScore>) {
        this.holeNumber = number;
        this.playerScores = playerScores;
    }

    toObject?() {
        return {
            holeNumber: this.holeNumber,
            playerScores: this.playerScores.map(playerScore => playerScore.toObject ? 
                playerScore.toObject() : playerScore)
        };
    }
}