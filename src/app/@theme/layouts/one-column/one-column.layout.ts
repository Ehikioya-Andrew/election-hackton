import { Component } from '@angular/core';
import { NbLayoutDirectionService } from '@nebular/theme';
import { OnlineStatService } from 'src/app/@core/utils/online-stat.service';

@Component({
  selector: 'app-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  templateUrl: './one-column.layout.html'
})
export class OneColumnLayoutComponent {
  constructor(
    public directionService: NbLayoutDirectionService,
    public onlineStat: OnlineStatService,
  ) { }
}
