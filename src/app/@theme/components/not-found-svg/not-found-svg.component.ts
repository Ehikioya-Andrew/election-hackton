import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found-svg',
  templateUrl: './not-found-svg.component.html',
  styleUrls: ['./not-found-svg.component.scss']
})
export class NotFoundSvgComponent implements OnInit {

  @Input() width = '100px';
  @Input() class = '';
  ngClassData: any = {};
  constructor() { }

  ngOnInit() {
    this.ngClassData[this.class] = true;
  }


}
