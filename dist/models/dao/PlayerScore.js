"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerScore = void 0;
class PlayerScore {
    score;
    player;
    constructor(score, player) {
        this.score = score;
        this.player = player;
    }
    toObject() {
        return {
            score: this.score,
            player: this.player.toObject ? this.player.toObject() : this.player
        };
    }
}
exports.PlayerScore = PlayerScore;
