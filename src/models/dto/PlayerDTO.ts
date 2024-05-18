import { PlayerColor } from "../dao/PlayerColor";
import { PlayerColorDTO } from "./PlayerColorDTO";

export class PlayerDTO {

    id: string;
    name: string;
    isHost: boolean;
    color: PlayerColorDTO;

    constructor(id: string, name : string, isHost : boolean, color : PlayerColorDTO) {
        this.id = id;
        this.name = name;
        this.isHost = isHost;
        this.color = color;
    }

    toObject?() {
        return {
            id: this.id,
            name: this.name,
            isHost: this.isHost,
            color: this.color.toObject ? this.color.toObject() : this.color
        };
    }
}