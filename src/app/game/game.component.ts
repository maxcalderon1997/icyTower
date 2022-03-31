import { AfterViewInit, Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JumpingPiece } from 'src/models/jumping-piece.model'
import { Score } from 'src/models/score.model'
import { Obstacle } from 'src/models/obstacle.model'
import { Clock } from 'src/models/clock.model';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit{
  canvasWidth: number = environment.canvasWidth;
  canvasHeight: number = environment.canvasHeight;
  static clock: Clock;
  static myGamePiece: JumpingPiece;
  static myObstacles: Obstacle[] = [];
  static myScore: Score;
  static myGameArea = {
    keys: [],
    canvas : undefined,
    start : function() {
      this.canvas = document.getElementById('game');
      GameComponent.myGamePiece = new JumpingPiece(30, 30, "red", 10, this.canvas.height, GameComponent.myGameArea);
      GameComponent.myGamePiece.y = this.canvas.height - GameComponent.myGamePiece.height;
      this.context = this.canvas.getContext("2d");
      GameComponent.myGamePiece.update();
      window.addEventListener('keydown', GameComponent.myGameArea.startObstacles);
      window.addEventListener('keydown', function (e) {
        GameComponent.myGameArea.keys[e.keyCode] = true;
      });
      window.addEventListener('keyup', function (e) {
        GameComponent.myGameArea.keys[e.keyCode] = false;
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
      GameComponent.clock = new Clock("30px", "Consolas", "black", 40, 80, GameComponent.myGameArea);
      GameComponent.clock.updateTime();
      GameComponent.clock.update();
      GameComponent.myGameArea.interval = setInterval(GameComponent.updateGameArea, 20);
      window.removeEventListener('keydown', GameComponent.myGameArea.startObstacles);
    }
  }
  context;
  
  constructor() {
    
  }
  ngAfterViewInit(): void {
    this.startGame();
  }

  startGame() {
    GameComponent.myGameArea.start();
    GameComponent.myGamePiece.gravity = 0.98;
    GameComponent.myScore = new Score("30px", "Consolas", "black", 40, 40, GameComponent.myGameArea);
    for (let i: number = 1; i <= environment.initialObstaclesNumber; i++) {
      GameComponent.createObstacle((environment.initialObstaclesNumber - i) * ((GameComponent.myGameArea.canvas.height) / environment.initialObstaclesNumber), i);
    }
    GameComponent.myObstacles.forEach((obstacle: Obstacle) => {
      obstacle.update();
    })
    GameComponent.myGamePiece.update();
  }

  static createObstacle(y, obstacleScore) {
    let minWidth: number = 100, maxWidth: number = 300;
    let width: number = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
    let x: number = Math.floor(Math.random()*(GameComponent.myGameArea.canvas.width - width));
    GameComponent.myObstacles.push(new Obstacle(width, 10, "green", x, y, GameComponent.myGameArea, obstacleScore));
  }

  static updateGameArea() {
      GameComponent.myGameArea.clear();
      if (GameComponent.myObstacles[0]?.y >= GameComponent.myGameArea.canvas.height) {
        GameComponent.createObstacle(GameComponent.myObstacles[0]?.y - GameComponent.myGameArea.canvas.height, GameComponent.myObstacles[GameComponent.myObstacles.length - 1].score + 1);
        GameComponent.myObstacles.shift();
      }
      let prevSpeed: number = GameComponent.myGamePiece.speedY;
      let didReset: boolean = false;
      if(GameComponent.myGamePiece.speedY < 0 && GameComponent.myGamePiece.y < GameComponent.myGameArea.canvas.height * 1/4) {
        for (let i = 0; i < GameComponent.myObstacles.length; i += 1) {
          GameComponent.myObstacles[i].y -= GameComponent.myGamePiece.speedY;
          GameComponent.myObstacles[i].update();
        }
        GameComponent.myGamePiece.speedY = 0;
        didReset = true;
      } else {
        for (let i = 0; i < GameComponent.myObstacles.length; i += 1) {
          GameComponent.myObstacles[i].y += environment.obstacleSpeed * (1 + 2*Clock.speed);
          GameComponent.myObstacles[i].update();
        }
      }
      GameComponent.myScore.update();
      GameComponent.clock.update();
      if (GameComponent.myGameArea.keys && GameComponent.myGameArea.keys[32] &&
        (GameComponent.myGamePiece.y == GameComponent.myGameArea.canvas.height - GameComponent.myGamePiece.height ||
          GameComponent.myGamePiece.didCrash())) {
        if (GameComponent.myGamePiece.speedX >= environment.speedXforBigJump || GameComponent.myGamePiece.speedX <= -environment.speedXforBigJump) {
          let audio = new Audio();
          audio.src = "../../../assets/sounds/harold_high_jump.ogg";
          audio.load();
          audio.play();
          GameComponent.accelerate(-environment.bigJumpSpeed);
        } else {
          GameComponent.accelerate(-environment.jumpSpeed);
        }
      }
      GameComponent.myGamePiece.newPos();
      GameComponent.myGamePiece.update();
      if (didReset) {
        GameComponent.myGamePiece.speedY = prevSpeed + GameComponent.myGamePiece.gravity;
      }
  }

  static accelerate(n) {
    GameComponent.myGamePiece.speedY += n;
  }

}
