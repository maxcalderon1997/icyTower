import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { component } from 'src/models/jumpingPiece.model'

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
  static didFirstObstableDisappear = false;
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
        AppComponent.didFirstObstableDisappear = true;
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
  }
}
