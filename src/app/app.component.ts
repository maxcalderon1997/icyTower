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
  gravitySpeed = 0;
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
      // this. = 0;
      // this.speedY = 0;
      if (AppComponent.myGameArea.keys && AppComponent.myGameArea.keys[37]) {
        this.speedX -= 0.2; 
      } else if (AppComponent.myGameArea.keys && AppComponent.myGameArea.keys[39]) {
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
      this.gravitySpeed += this.gravity;
      this.x += this.speedX;
      if (this.speedY != 0) {
        console.log('y ' + this.y);
      }
      this.y += this.speedY + this.gravitySpeed;
      if (this.speedY != 0) {
        console.log('speed ' + this.speedY);
        console.log('y ' + this.y);
      }
      this.hitBottom();
  }
  
  hitBottom() {
      var rockbottom = this.myGameArea.canvas.height - this.height;
      if (this.y > rockbottom) {
          this.y = rockbottom;
          this.gravitySpeed = 0;
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
  
  crashWith(otherobj) {
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y;
      var mybottom = this.y + (this.height);
      var otherleft = otherobj.x;
      var otherright = otherobj.x + (otherobj.width);
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + (otherobj.height);
      var crash = true;
      if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
          crash = false;
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
  myObstacles = [];
  myScore;
  static myGameArea = {
      keys: [],
      canvas : document.createElement("canvas"),
      start : function(updateGameArea) {
          this.canvas.width = 1000;
          this.canvas.height = 550;
          this.canvas.style.border = "1px solid black";
          this.canvas.style.marginLeft = "100px";
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
      var x, height, gap, minHeight, maxHeight, minGap, maxGap;
      for (let i = 0; i < this.myObstacles.length; i += 1) {
          if (this.myGamePiece.crashWith(this.myObstacles[i])) {
              return;
          } 
      }
      AppComponent.myGameArea.clear();
      AppComponent.myGameArea.frameNo += 1;
      if (AppComponent.myGameArea.frameNo == 1 || this.everyinterval(150)) {
          // x = AppComponent.myGameArea.canvas.width;
          // minHeight = 20;
          // maxHeight = 200;
          // height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
          // minGap = 50;
          // maxGap = 200;
          // gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
          // this.myObstacles.push(new component(10, height, "green", x, 0, "", AppComponent.myGameArea));
          // this.myObstacles.push(new component(10, x - height - gap, "green", x, height + gap,  "", AppComponent.myGameArea));
      }
      for (let i = 0; i < this.myObstacles.length; i += 1) {
          this.myObstacles[i].x += -1;
          this.myObstacles[i].update();
      }
      // this.myScore.text="SCORE: " + AppComponent.myGameArea.frameNo;
      // this.myScore.update();
      if (AppComponent.myGameArea.keys && AppComponent.myGameArea.keys[32]) {
        this.accelerate(-30);
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
