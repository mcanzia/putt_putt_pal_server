"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerDTO = void 0;
class PlayerDTO {
    id;
    name;
    playerNumber;
    constructor(id, name, playerNumber) {
        this.id = id;
        this.name = name;
        this.playerNumber = playerNumber;
    }
    toObject() {
        return {
            id: this.id,
            name: this.name,
            playerNumber: this.playerNumber
        };
    }
}
exports.PlayerDTO = PlayerDTO;
