import { environment } from '../environments/environment';
import { AppComponent } from '../app/app.component'

export abstract class AbstractGameComponent {  
  color: string;
  x: number;
  y: number;
  myGameArea;

  constructor(color: string, x: number, y: number, myGameArea){
    this.color = color;
    this.x = x;
    this.y = y;
    this.myGameArea = myGameArea;
  }
  
  abstract update();
}