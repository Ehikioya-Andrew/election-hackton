import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent {

  @Input()
  title = '';
  @Input()
  info = '';
  @Input()
  content = '';
  @Input()
  icon = '';
  @Input()
  link = '';

  constructor(private router: Router) { }


  route(): void {
    if (this.link) {
      this.router.navigateByUrl(this.link);
    }
  }

}
