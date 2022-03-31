import { AbstractGameComponent } from '../models/abstract-game-component.model';
import { GameComponent } from '../app/game/game.component';
import { IHasScore } from '../app/interfaces/has-score.interface'
export class Score extends AbstractGameComponent implements IHasScore {
    score:number = 0;
    text = "SCORE: ";
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
        ctx.fillText(this.text + this.score, this.x, this.y);
        if (this.text.startsWith("Game Over!")) {
            clearInterval(GameComponent.myGameArea.interval);
        }
    }
}