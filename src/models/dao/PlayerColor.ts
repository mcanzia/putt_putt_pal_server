export class PlayerColor {

    color: String;

    constructor(color: String) {
        this.color = color;
    }

    static createBaseColors() : Array<PlayerColor> {
        const colorCodes : Array<String> = [
            '0xffcc0000', // red
            '0xff6aa84f', // green
            '0xff45818e', // teal
            '0xff3d85c6', // blue
            '0xff674ea7', // indigo
            '0xffa64d79', // violet
            '0xff614247', // brown
            '0xffe69138', // orange
            '0xfff1c232', // yellow
            '0xffff7799', // pink
            '0xff999999', // gray
            '0xffffffff', // white
        ];
        const baseColors : Array<PlayerColor> = [];

        for (let i = 0; i < 12; i++) {
            baseColors.push(new PlayerColor(colorCodes[i]));
        }

        return baseColors;
    }

    toObject?() {
        return {
            color: this.color,
        };
    }

}