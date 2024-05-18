import { PlayerDTO } from "./PlayerDTO";

export class PlayerScoreDTO {

    id: string;
    score: number;
    playerId: string;

    constructor(id: string, score : number, playerId : string) {
        this.id = id;
        this.score = score;
        this.playerId = playerId;
    }

    toObject?() {
        return {
            id: this.id,
            score: this.score,
            playerId: this.playerId
        };
    }
}