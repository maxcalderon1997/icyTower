import { environment } from '../../src/environments/environment';
import { AppComponent } from '../../src/app/app.component'

export class component {

    type;
    score = 0;
    width;
    height;
    speedX = 0;
    _speedY = 0;    
    x;
    y;
    gravity = 0;
    color;
    myGameArea;
    text = "";
  
    constructor(width, height, color, x, y, type, myGameArea, score?){
      this.type = type;
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.color = color;
      this.myGameArea = myGameArea;
      if (score) {
        this.score = score;
      }
    }
  
    set speedY(value: any) {
      this._speedY = value;
    }
    get speedY(): any {
      return this._speedY;
    }
    
    update() {
        let ctx = this.myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    
    newPos() {
        if (AppComponent.myGameArea.keys && AppComponent.myGameArea.keys[37]) {
          if(this.speedX > environment.stopSpeedLimit){
            this.speedX = environment.stopSpeedLimit;
          }
          this.speedX -= environment.accelerationX; 
        } else if (AppComponent.myGameArea.keys && AppComponent.myGameArea.keys[39]) {
          if(this.speedX < -environment.stopSpeedLimit){
            this.speedX = -environment.stopSpeedLimit;
          }
          this.speedX += environment.accelerationX; 
        } else {
          if (this.speedX > 0) {
            if(this.speedX > environment.stopSpeedLimit){
              this.speedX = environment.stopSpeedLimit;
            }
            if (this.speedX < environment.stopAccelerationX) {
              this.speedX = 0;
            }
            this.speedX -= environment.stopAccelerationX;
          }
          else if (this.speedX < 0) {
            if(this.speedX < -environment.stopSpeedLimit){
              this.speedX = -environment.stopSpeedLimit;
            }
            if (this.speedX > -environment.stopAccelerationX) {
              this.speedX = 0;
            }
            this.speedX += environment.stopAccelerationX;
          }
        }
        this.speedX = parseFloat(this.speedX.toFixed(2));
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.hitBottom();
        
        if (!this.didCrash()) {
          this.gravity = environment.gravity;
        }
    }
    
    hitBottom() {
        var rockbottom = this.myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            if(AppComponent.didFirstObstableDisappear) {
              clearInterval(AppComponent.myGameArea.interval);
            }
            this.y = rockbottom;
            this.speedY = 0;
        }
        if (this.x < 0) {
            this.x = 0;
            this.speedX = -this.speedX/2;
            this.speedX = parseFloat(this.speedX.toFixed(2));
        }
        if (this.x + this.width > this.myGameArea.canvas.width) {
          this.x = this.myGameArea.canvas.width - this.width;
          this.speedX = -this.speedX/2;
          this.speedX = parseFloat(this.speedX.toFixed(2));
      }
    }
  
    didCrash() {
      for (let i = 0; i < AppComponent.myObstacles.length; i += 1) {
        if (this.crashWith(AppComponent.myObstacles[i])) {
          this.y = AppComponent.myObstacles[i].y - this.height;
          this.speedY = 0.5;
          this.gravity = 0;
          return true;
        } 
      }
      return false;
    }
    
    crashWith(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var crash = false;
        if (this.speedY >= 0 && (mybottom <= othertop) && (mybottom >= othertop - this.speedY) && (myright >= otherleft) && (myleft <= otherright)) {
            crash = true;
            AppComponent.myScore.text="SCORE: " + otherobj.score;
        }
        return crash;
    }
  }