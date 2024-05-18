"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerScoreDTO = void 0;
class PlayerScoreDTO {
    id;
    score;
    playerId;
    constructor(id, score, playerId) {
        this.id = id;
        this.score = score;
        this.playerId = playerId;
    }
    toObject() {
        return {
            id: this.id,
            score: this.score,
            playerId: this.playerId
        };
    }
}
exports.PlayerScoreDTO = PlayerScoreDTO;
