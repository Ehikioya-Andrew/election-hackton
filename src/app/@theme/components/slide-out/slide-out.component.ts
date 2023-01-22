import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slide-out',
  styleUrls: ['./slide-out.component.scss'],
  templateUrl: './slide-out.component.html',
})
export class SlideOutComponent {

  @Input() show: boolean = false;
  @Input()
  public set showSlideOutByDefault(v: boolean) {
    if (v) {
      this.show = true;
      setTimeout(() => {
        this.show = false;
      }, 5 * 60 * 60 * 1000);
    }
  }

  @Input()
  public set slideOutWidth(v: string) {
    (document.querySelector(':root') as HTMLElement)
      .style
      .setProperty('--slide-out-container-width', v ?? '40%');
  }
  // Outputs
  @Output()
  selection: EventEmitter<any> = new EventEmitter();
  toggleSlideout() {
    this.show = !this.show;
    this.selection.emit(this.show);
  }


}
