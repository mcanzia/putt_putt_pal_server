import { PlayerColor } from "./PlayerColor";

export class Player {

    name: string;
    isHost: boolean;
    color: PlayerColor;

    constructor(name : string, isHost : boolean, color : PlayerColor) {
        this.name = name;
        this.isHost = isHost;
        this.color = color;
    }

    toObject?() {
        return {
            name: this.name,
            isHost: this.isHost,
            color: this.color.toObject ? this.color.toObject() : this.color
        };
    }
}