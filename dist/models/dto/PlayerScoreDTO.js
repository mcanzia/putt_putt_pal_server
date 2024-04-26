"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerScoreDTO = void 0;
class PlayerScoreDTO {
    id;
    score;
    player;
    constructor(id, score, player) {
        this.id = id;
        this.score = score;
        this.player = player;
    }
    toObject() {
        return {
            id: this.id,
            score: this.score,
            player: this.player.toObject ? this.player.toObject() : this.player
        };
    }
}
exports.PlayerScoreDTO = PlayerScoreDTO;
