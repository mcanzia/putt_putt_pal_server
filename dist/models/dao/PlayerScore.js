"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerScore = void 0;
class PlayerScore {
    score;
    playerId;
    constructor(score, playerId) {
        this.score = score;
        this.playerId = playerId;
    }
    toObject() {
        return {
            score: this.score,
            playerId: this.playerId
        };
    }
}
exports.PlayerScore = PlayerScore;
