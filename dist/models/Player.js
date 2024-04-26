"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    name;
    playerNumber;
    constructor(name, playerNumber) {
        this.name = name;
        this.playerNumber = playerNumber;
    }
    toObject() {
        return {
            name: this.name,
            playerNumber: this.playerNumber
        };
    }
}
exports.Player = Player;
