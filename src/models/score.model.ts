import { AbstractGameComponent } from '../models/abstract-game-component.model';

export class Score extends AbstractGameComponent {
    score = 0;
    text = "";
    fontSize: string;
    fontStyle: string;
  
    constructor(fontSize, fontStyle, color, x, y, myGameArea){
        super(color, x, y, myGameArea);
        this.fontSize = fontSize;
        this.fontStyle = fontStyle;
    }
    
    update() {
        let ctx = this.myGameArea.context;
        ctx.font = this.fontSize + " " + this.fontStyle;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
    }
}