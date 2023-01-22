import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AuditService } from 'src/app/@core/data-services/audit.services';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  submitted = false;

  @Input() context = '';
  @Input() title = '';
  @Input() showReadCarefully = false;

  constructor(
    public dialogRef: NbDialogRef<ConfirmationDialogComponent>,
  ) { }


  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

}
