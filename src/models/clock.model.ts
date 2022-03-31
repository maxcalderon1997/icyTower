import { environment } from "src/environments/environment";
import { AbstractGameComponent } from "./abstract-game-component.model";

export class Clock extends AbstractGameComponent{
    static time = 0;
    static speed = 0;
    fontSize: string;
    fontStyle: string;
    canvas;

    constructor(fontSize, fontStyle, color, x, y, myGameArea){
        super(color, x, y, myGameArea);
        this.fontSize = fontSize;
        this.fontStyle = fontStyle;
    }

    updateTime() {
        Clock.time += 1;
        if (Clock.time >= environment.timeToSpeedUp) {
            Clock.speed += 1;
            Clock.time = 0;
            let audio = new Audio();
            audio.src = "../../../assets/sounds/ring.ogg";
            audio.load();
            audio.play();
        }
        setTimeout(this.updateTime.bind(this), 1000);
    }

    update() {
        // let ctx = this.canvas.getContext("2d");
        // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // ctx.font = this.fontSize + " " + this.fontStyle;
        // ctx.fillStyle = this.color;
        // ctx.fillText('Time left to speed up: ' + (environment.timeToSpeedUp - Clock.time), this.x, this.y);
    }
}