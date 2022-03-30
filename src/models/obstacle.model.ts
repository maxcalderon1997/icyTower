import { IHasScore } from 'src/app/interfaces/has-score.interface';
import { AbstractMovingPiece } from '../models/abstract-moving-piece.model';

export class Obstacle extends AbstractMovingPiece implements IHasScore {
    score: number = 0;

    constructor(width, height, color, x, y, myGameArea, score){
        super(width, height, color, x, y, myGameArea);
        this.score = score;
    }  
}