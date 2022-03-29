import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

class component {

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
          if(AppComponent.wasHigh) {
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'icyTower';
  static myGamePiece;
  static myObstacles = [];
  static myScore;
  static wasHigh = false;
  static myGameArea = {
      keys: [],
      canvas : document.createElement("canvas"),
      start : function() {
          this.canvas.width = environment.canvasWidth;
          this.canvas.height = environment.canvasHeight;
          AppComponent.myGamePiece.y = this.canvas.height - AppComponent.myGamePiece.height;
          this.canvas.style.border = "1px solid black";
          this.canvas.style.marginLeft = "200px";
          this.context = this.canvas.getContext("2d");
          AppComponent.myGamePiece.update();
          document.body.insertBefore(this.canvas, document.body.childNodes[0]);
          window.addEventListener('keydown', AppComponent.myGameArea.startObstacles);
          window.addEventListener('keydown', function (e) {
            AppComponent.myGameArea.keys[e.keyCode] = true;
          });
          window.addEventListener('keyup', function (e) {
            AppComponent.myGameArea.keys[e.keyCode] = false;
          });
          },
      clear : function() {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      },
      interval: undefined,
      startObstacles : function() {
        AppComponent.myGameArea.interval = setInterval(AppComponent.updateGameArea, 20);
        window.removeEventListener('keydown', AppComponent.myGameArea.startObstacles);
      }
  }

  constructor() {
    this.startGame();
  }

  startGame() {
    AppComponent.myGamePiece = new component(30, 30, "red", 10, AppComponent.myGameArea.canvas.height, "", AppComponent.myGameArea);
    AppComponent.myGamePiece.gravity = 0.98;
    AppComponent.myScore = new component("30px", "Consolas", "black", 280, 40, "text", AppComponent.myGameArea);
    AppComponent.myGameArea.start();
    for (let i = 0; i < 5; i++) {
      AppComponent.createObstacle((4-i) * ((AppComponent.myGameArea.canvas.height) / 5));
    }
    AppComponent.myObstacles.forEach(obstacle => {
      obstacle.update();
    })
    AppComponent.myGamePiece.update();
  }

  static createObstacle(y) {
    let minWidth = 100, maxWidth = 300;
    let width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
    let x = Math.floor(Math.random()*(AppComponent.myGameArea.canvas.width - width));
    AppComponent.myScore.score += 1;
    AppComponent.myObstacles.push(new component(width, 10, "green", x, y, "", AppComponent.myGameArea, AppComponent.myScore.score));
  }

  static updateGameArea() {
      AppComponent.myGameArea.clear();
      if (AppComponent.myObstacles[0]?.y >= AppComponent.myGameArea.canvas.height) {
        AppComponent.createObstacle(AppComponent.myObstacles[0]?.y - AppComponent.myGameArea.canvas.height);
        AppComponent.myObstacles.shift();
      }
      let prevSpeed = AppComponent.myGamePiece.speedY;
      let didReset: boolean = false;
      if(AppComponent.myGamePiece.speedY < 0 && AppComponent.myGamePiece.y < AppComponent.myGameArea.canvas.height * 1/4) {
        for (let i = 0; i < AppComponent.myObstacles.length; i += 1) {
          AppComponent.myObstacles[i].y -= AppComponent.myGamePiece.speedY;
          AppComponent.myObstacles[i].update();
        }
        AppComponent.myGamePiece.speedY = 0;
        didReset = true;
      } else {
        for (let i = 0; i < AppComponent.myObstacles.length; i += 1) {
          AppComponent.myObstacles[i].y += environment.obstacleSpeed;
          AppComponent.myObstacles[i].update();
        }
      }
      AppComponent.myScore.update();
      if (AppComponent.myGameArea.keys && AppComponent.myGameArea.keys[32] &&
        (AppComponent.myGamePiece.y == AppComponent.myGameArea.canvas.height - AppComponent.myGamePiece.height ||
          AppComponent.myGamePiece.didCrash())) {
        AppComponent.accelerate(-environment.jumpSpeed);
      }
      AppComponent.myGamePiece.newPos();
      AppComponent.myGamePiece.update();
      if (didReset) {
        AppComponent.myGamePiece.speedY = prevSpeed + AppComponent.myGamePiece.gravity;
      }
  }

  static accelerate(n) {
    AppComponent.myGamePiece.speedY = n;
    AppComponent.wasHigh = true;
  }
}
