"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    name;
    isHost;
    color;
    constructor(name, isHost, color) {
        this.name = name;
        this.isHost = isHost;
        this.color = color;
    }
    toObject() {
        return {
            name: this.name,
            isHost: this.isHost,
            color: this.color.toObject ? this.color.toObject() : this.color
        };
    }
}
exports.Player = Player;
