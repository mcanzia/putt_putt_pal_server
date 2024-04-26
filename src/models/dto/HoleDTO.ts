import { PlayerScoreDTO } from "./PlayerScoreDTO";

export class HoleDTO {

    id : string;
    holeNumber: number;
    playerScores: Array<PlayerScoreDTO>;

    constructor(id: string, number : number, playerScores : Array<PlayerScoreDTO>) {
        this.id = id;
        this.holeNumber = number;
        this.playerScores = playerScores;
    }

    toObject?() {
        return {
            id: this.id,
            holeNumber: this.holeNumber,
            playerScores: this.playerScores.map(playerScore => playerScore.toObject ? 
                playerScore.toObject() : playerScore)
        };
    }
}