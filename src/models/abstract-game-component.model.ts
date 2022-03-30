import { environment } from '../environments/environment';
import { AppComponent } from '../app/app.component'

export abstract class AbstractGameComponent {
  //Obstacle: score = 0;
  // MovingPiece: width: number;
  // MovingPiece: height: number;
  // MovingPiece: speedX = 0;
  // MovingPiece: _speedY = 0;    
  color: string;
  x: number;
  y: number;
  //jumpingPiece: gravity = 0;
  myGameArea;
  //Score: text = "";

  constructor(color: string, x: number, y: number, myGameArea){
    this.color = color;
    this.x = x;
    this.y = y;
    this.myGameArea = myGameArea;
  }
  
  abstract update();
}