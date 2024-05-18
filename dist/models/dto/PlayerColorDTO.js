"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerColorDTO = void 0;
class PlayerColorDTO {
    id;
    color;
    constructor(id, color) {
        this.id = id;
        this.color = color;
    }
    static createBaseColors() {
        const colorCodes = [
            '0xffcc0000',
            '0xff6aa84f',
            '0xff45818e',
            '0xff3d85c6',
            '0xff674ea7',
            '0xffa64d79',
            '0xff614247',
            '0xffe69138',
            '0xfff1c232',
            '0xffff7799',
            '0xff999999',
            '0xffffffff', // white
        ];
        const baseColors = [];
        for (let i = 0; i < 12; i++) {
            baseColors.push(new PlayerColorDTO(i + 1, colorCodes[i]));
        }
        return baseColors;
    }
    toObject() {
        return {
            id: this.id,
            color: this.color,
        };
    }
}
exports.PlayerColorDTO = PlayerColorDTO;
