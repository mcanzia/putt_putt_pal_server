import { Player } from "./Player";

export class PlayerScore {

    score: number;
    player: Player;

    constructor(score : number, player : Player) {
        this.score = score;
        this.player = player;
    }

    toObject?() {
        return {
            score: this.score,
            player: this.player.toObject ? this.player.toObject() : this.player
        };
    }
}