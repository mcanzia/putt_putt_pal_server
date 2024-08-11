export class PlayerColorDTO {

    id: number;
    color: String;
    textColor: String;

    constructor(id: number, color: String, textColor: String) {
        this.id = id;
        this.color = color;
        this.textColor = textColor;
    }

    static createBaseColors() : Array<PlayerColorDTO> {
        type ColorCode = {
            color : String,
            textColor : String
        }
        const colorCodes: Array<ColorCode> = [
            { color: '0xffcc0000', textColor: '0xffffffff' }, // red
            { color: '0xff6aa84f', textColor: '0xffffffff' }, // green
            { color: '0xff45818e', textColor: '0xffffffff' }, // teal
            { color: '0xff3d85c6', textColor: '0xffffffff' }, // blue
            { color: '0xff674ea7', textColor: '0xffffffff' }, // indigo
            { color: '0xffa64d79', textColor: '0xffffffff' }, // violet
            { color: '0xff614247', textColor: '0xffffffff' }, // brown
            { color: '0xffe69138', textColor: '0xffffffff' }, // orange
            { color: '0xfff1c232', textColor: '0xff000000' }, // yellow
            { color: '0xffff7799', textColor: '0xff000000' }, // pink
            { color: '0xff999999', textColor: '0xff000000' }, // gray
            { color: '0xffffffff', textColor: '0xff000000' }, // white
        ];
        
        const baseColors : Array<PlayerColorDTO> = [];

        for (let i = 0; i < 12; i++) {
            baseColors.push(new PlayerColorDTO(i + 1, colorCodes[i].color, colorCodes[i].textColor));
        }

        return baseColors;
    }

    toObject?() {
        return {
            id: this.id,
            color: this.color,
            textColor: this.textColor
        };
    }

}