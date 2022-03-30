import { AbstractGameComponent } from "./abstract-game-component.model";

export class Clock extends AbstractGameComponent{
    static time = 0;
    fontSize: string;
    fontStyle: string;

    constructor(fontSize, fontStyle, color, x, y, myGameArea){
        super(color, x, y, myGameArea);
        this.fontSize = fontSize;
        this.fontStyle = fontStyle;
    }

    updateTime() {
        Clock.time += 1;
        setTimeout(this.updateTime.bind(this), 1000);
    }

    update() {
        let ctx = this.myGameArea.context;
        ctx.font = this.fontSize + " " + this.fontStyle;
        ctx.fillStyle = this.color;
        ctx.fillText('Time: ' + Clock.time, this.x, this.y);
    }
}