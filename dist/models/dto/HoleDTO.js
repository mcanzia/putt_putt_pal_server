"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoleDTO = void 0;
class HoleDTO {
    id;
    holeNumber;
    playerScores;
    constructor(id, number, playerScores) {
        this.id = id;
        this.holeNumber = number;
        this.playerScores = playerScores;
    }
    toObject() {
        return {
            id: this.id,
            holeNumber: this.holeNumber,
            playerScores: this.playerScores.map(playerScore => playerScore.toObject ?
                playerScore.toObject() : playerScore)
        };
    }
}
exports.HoleDTO = HoleDTO;
