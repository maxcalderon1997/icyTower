import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JumpingPiece } from 'src/models/jumping-piece.model'
import { Score } from 'src/models/score.model'
import { Obstacle } from 'src/models/obstacle.model'
import { timer } from 'rxjs';
import { Clock } from 'src/models/clock.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  static clock: Clock;
  title = 'icyTower';
  static myGamePiece: JumpingPiece;
  static myObstacles: Obstacle[] = [];
  static myScore: Score;
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
      let audio = new Audio();
      audio.src = "../../../assets/sounds/IcyTowerTheme.mp3";
      audio.loop = true;
      audio.load();
      audio.play();
      AppComponent.clock = new Clock("30px", "Consolas", "black", 40, 80, AppComponent.myGameArea);
      AppComponent.clock.updateTime();
      AppComponent.myGameArea.interval = setInterval(AppComponent.updateGameArea, 20);
      window.removeEventListener('keydown', AppComponent.myGameArea.startObstacles);
    }
  }

  constructor() {
    this.startGame();
  }

  startGame() {
    AppComponent.myGamePiece = new JumpingPiece(30, 30, "red", 10, AppComponent.myGameArea.canvas.height, AppComponent.myGameArea);
    AppComponent.myGamePiece.gravity = 0.98;
    AppComponent.myScore = new Score("30px", "Consolas", "black", 40, 40, AppComponent.myGameArea);
    AppComponent.myGameArea.start();
    for (let i: number = 1; i <= environment.initialObstaclesNumber; i++) {
      AppComponent.createObstacle((environment.initialObstaclesNumber - i) * ((AppComponent.myGameArea.canvas.height) / environment.initialObstaclesNumber), i);
    }
    AppComponent.myObstacles.forEach((obstacle: Obstacle) => {
      obstacle.update();
    })
    AppComponent.myGamePiece.update();
    AppComponent.clock.update();
  }

  static createObstacle(y, obstacleScore) {
    let minWidth: number = 100, maxWidth: number = 300;
    let width: number = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
    let x: number = Math.floor(Math.random()*(AppComponent.myGameArea.canvas.width - width));
    AppComponent.myObstacles.push(new Obstacle(width, 10, "green", x, y, AppComponent.myGameArea, obstacleScore));
  }

  static updateGameArea() {
      AppComponent.myGameArea.clear();
      if (AppComponent.myObstacles[0]?.y >= AppComponent.myGameArea.canvas.height) {
        AppComponent.createObstacle(AppComponent.myObstacles[0]?.y - AppComponent.myGameArea.canvas.height, AppComponent.myObstacles[AppComponent.myObstacles.length - 1].score + 1);
        AppComponent.myObstacles.shift();
      }
      let prevSpeed: number = AppComponent.myGamePiece.speedY;
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
          AppComponent.myObstacles[i].y += environment.obstacleSpeed * (1 + 2*Clock.speed);
          AppComponent.myObstacles[i].update();
        }
      }
      AppComponent.myScore.update();
      AppComponent.clock.update();
      if (AppComponent.myGameArea.keys && AppComponent.myGameArea.keys[32] &&
        (AppComponent.myGamePiece.y == AppComponent.myGameArea.canvas.height - AppComponent.myGamePiece.height ||
          AppComponent.myGamePiece.didCrash())) {
        if (AppComponent.myGamePiece.speedX >= environment.speedXforBigJump || AppComponent.myGamePiece.speedX <= -environment.speedXforBigJump) {
          let audio = new Audio();
          audio.src = "../../../assets/sounds/harold_high_jump.ogg";
          audio.load();
          audio.play();
          AppComponent.accelerate(-environment.bigJumpSpeed);
        } else {
          AppComponent.accelerate(-environment.jumpSpeed);
        }
      }
      AppComponent.myGamePiece.newPos();
      AppComponent.myGamePiece.update();
      if (didReset) {
        AppComponent.myGamePiece.speedY = prevSpeed + AppComponent.myGamePiece.gravity;
      }
  }

  static accelerate(n) {
    AppComponent.myGamePiece.speedY += n;
  }
}
