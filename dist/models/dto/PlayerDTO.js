"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerDTO = void 0;
class PlayerDTO {
    id;
    name;
    isHost;
    color;
    constructor(id, name, isHost, color) {
        this.id = id;
        this.name = name;
        this.isHost = isHost;
        this.color = color;
    }
    toObject() {
        return {
            id: this.id,
            name: this.name,
            isHost: this.isHost,
            color: this.color.toObject ? this.color.toObject() : this.color
        };
    }
}
exports.PlayerDTO = PlayerDTO;
