import { PlayerDTO } from "./PlayerDTO";

export class PlayerScoreDTO {

    id: string;
    score: number;
    player: PlayerDTO;

    constructor(id: string, score : number, player : PlayerDTO) {
        this.id = id;
        this.score = score;
        this.player = player;
    }

    toObject?() {
        return {
            id: this.id,
            score: this.score,
            player: this.player.toObject ? this.player.toObject() : this.player
        };
    }
}