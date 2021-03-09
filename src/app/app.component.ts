import { Component } from '@angular/core';

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

  constructor(width, height, color, x, y, type, myGameArea){
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
    this.myGameArea = myGameArea;
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
        if(this.speedX > 5){
          this.speedX = 5;
        }
        this.speedX -= 0.2; 
      } else if (AppComponent.myGameArea.keys && AppComponent.myGameArea.keys[39]) {
        if(this.speedX < -5){
          this.speedX = -5;
        }
        this.speedX += 0.2; 
      } else {
        if (this.speedX > 0) {
          this.speedX -= 0.2;
        }
        if (this.speedX < 0) {
          this.speedX += 0.2;
        }
      }
      this.speedX = parseFloat(this.speedX.toFixed(2));
      this.x += this.speedX;
      this.speedY += this.gravity;
      this.y += this.speedY;
      this.hitBottom();
      
      if (!this.didCrash()) {
        this.gravity = 0.98;
      }
  }
  
  hitBottom() {
      var rockbottom = this.myGameArea.canvas.height - this.height;
      if (this.y > rockbottom) {
          this.y = rockbottom;
          this.speedY = 0;
      }
      if (this.x < 0) {
          this.x = 0;
          this.speedX = -this.speedX/2;
      }
      if (this.x + this.width > this.myGameArea.canvas.width) {
        this.x = this.myGameArea.canvas.width - this.width;
        this.speedX = -this.speedX/2;
    }
  }

  didCrash() {
    let didCrash: boolean = false;
    for (let i = 0; i < AppComponent.myObstacles.length; i += 1) {
      if (this.crashWith(AppComponent.myObstacles[i])) {
        this.y = AppComponent.myObstacles[i].y - this.height;
        this.speedY = 1;
        this.gravity = 0;
        didCrash = true;
      } 
    }
    return didCrash;
  }
  
  crashWith(otherobj) {
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y;
      var mybottom = this.y + (this.height);
      var otherleft = otherobj.x;
      var otherright = otherobj.x + (otherobj.width);
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + (otherobj.height);
      var crash = false;
      if (this.speedY > 0 && (mybottom <= othertop) && (mybottom >= othertop - this.speedY) && (myright >= otherleft) && (myleft <= otherright)) {
          crash = true;
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
  myGamePiece;
  static myObstacles = [];
  myScore;
  static myGameArea = {
      keys: [],
      canvas : document.createElement("canvas"),
      start : function(updateGameArea) {
          this.canvas.width = 800;
          this.canvas.height = 550;
          this.canvas.style.border = "1px solid black";
          this.canvas.style.marginLeft = "200px";
          this.context = this.canvas.getContext("2d");
          document.body.insertBefore(this.canvas, document.body.childNodes[0]);
          this.frameNo = 0;
          updateGameArea();
          this.interval = setInterval(updateGameArea, 20);
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
      frameNo: 0,
      interval: undefined
  }

  constructor() {
    this.startGame();
  }

  startGame() {
      this.myGamePiece = new component(30, 30, "red", 10, 120, "", AppComponent.myGameArea);
      this.myGamePiece.gravity = 0.98;
      this.myScore = new component("30px", "Consolas", "black", 280, 40, "text", AppComponent.myGameArea);
      AppComponent.myGameArea.start(this.updateGameArea.bind(this));
  }

  updateGameArea() {
      var x, y, width, minWidth, maxWidth;
      AppComponent.myGameArea.clear();
      AppComponent.myGameArea.frameNo += 1;
      if (AppComponent.myGameArea.frameNo == 1 || this.everyinterval(150)) {
          y = AppComponent.myGameArea.canvas.height;
          minWidth = 100;
          maxWidth = 300;
          width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
          x = Math.floor(Math.random()*(AppComponent.myGameArea.canvas.width - width));
          if(AppComponent.myObstacles.length > 5){
            AppComponent.myObstacles.shift();
          }
          AppComponent.myObstacles.push(new component(width, 10, "green", x, 0, "", AppComponent.myGameArea));
      }
      for (let i = 0; i < AppComponent.myObstacles.length; i += 1) {
        AppComponent.myObstacles[i].y += 1;
        AppComponent.myObstacles[i].update();
      }
      this.myScore.text="SCORE: " + AppComponent.myGameArea.frameNo;
      this.myScore.update();
      if (AppComponent.myGameArea.keys && AppComponent.myGameArea.keys[32] &&
        (this.myGamePiece.y == AppComponent.myGameArea.canvas.height - this.myGamePiece.height ||
          this.myGamePiece.didCrash())) {
        this.accelerate(-20);
      }
      this.myGamePiece.newPos();
      this.myGamePiece.update();
  }

  everyinterval(n) {
      if ((AppComponent.myGameArea.frameNo / n) % 1 == 0) {return true;}
      return false;
  }

  accelerate(n) {
      // if (!AppComponent.myGameArea.interval) {AppComponent.myGameArea.interval = setInterval(this.updateGameArea.bind(this), 20);}
      this.myGamePiece.speedY = n;
  }
}
