import { Player } from "./Player";

export class PlayerScore {

    score: number;
    playerId: String;

    constructor(score : number, playerId : String) {
        this.score = score;
        this.playerId = playerId;
    }

    toObject?() {
        return {
            score: this.score,
            playerId: this.playerId
        };
    }
}