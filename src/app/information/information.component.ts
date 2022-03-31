import { AfterViewInit, Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements AfterViewInit {
  canvas;
  context;
  canvasWidth = environment.canvasWidth;
  canvasHeight = environment.canvasHeight;
  constructor() {
  }
  ngAfterViewInit(): void {
    this.canvas = document.getElementById('information');
    this.context = this.canvas.getContext('2d');
  }
}
