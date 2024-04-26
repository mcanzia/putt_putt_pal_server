"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hole = void 0;
class Hole {
    holeNumber;
    playerScores;
    constructor(number, playerScores) {
        this.holeNumber = number;
        this.playerScores = playerScores;
    }
    toObject() {
        return {
            holeNumber: this.holeNumber,
            playerScores: this.playerScores.map(playerScore => playerScore.toObject ?
                playerScore.toObject() : playerScore)
        };
    }
}
exports.Hole = Hole;
