import { AbstractGameComponent } from '../models/abstract-game-component.model';

export class AbstractMovingPiece extends AbstractGameComponent {
    speedX = 0;
    speedY = 0;
    width: number;
    height: number
  
    constructor(width: number, height: number, color, x, y, myGameArea){
        super(color, x, y, myGameArea);
        this.width = width;
        this.height = height;
    }
    
    update() {
        let ctx = this.myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }